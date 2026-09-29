"""
FSSAI Food Safety and Standards (Recovery and Distribution of Surplus Food) Regulations, 2019
Implementation rules, safety score engine, and validation constraints.
"""
from datetime import datetime, timedelta
from typing import Dict, Any, Tuple

# FSSAI Constants
MIN_HOT_HOLDING_TEMP_C = 60.0    # Hot food must be held at >= 60°C
MAX_COLD_HOLDING_TEMP_C = 5.0     # Chilled food must be held at <= 5°C
MAX_HOT_ROOM_TEMP_HOURS = 4.0     # Max room temperature exposure window for cooked food
DEFAULT_HOT_CONSUMPTION_WINDOW = 3.5  # Safe consumption window (hours) from cook/pack
CO2E_FACTOR_PER_KG = 2.5          # kg CO2e avoided per kg food waste (WRAP/IPCC benchmark)
MEAL_KG_EQUIVALENT = 0.4          # 1 standard meal = 400g (0.4 kg) as per FSSAI/NIN dietary guidelines

def validate_fssai_licence(licence_no: str) -> Dict[str, Any]:
    """
    Validates Indian FSSAI 14-digit licence registration number format.
    FSSAI format: 14 numeric digits.
    First digit: 1 (Licence) or 2 (Registration).
    Next 2 digits: State code.
    Next 2 digits: Year of registration.
    Next 3 digits: Enrolling authority.
    Last 6 digits: Serial number.
    """
    clean_no = licence_no.strip().replace(" ", "").replace("-", "")
    if len(clean_no) == 14 and clean_no.isdigit():
        return {
            "valid_format": True,
            "licence_type": "State/Central Licence" if clean_no[0] == "1" else "Registration",
            "state_code": clean_no[1:3],
            "year": f"20{clean_no[3:5]}",
            "message": "Valid 14-digit FSSAI format"
        }
    return {
        "valid_format": False,
        "licence_type": "Invalid",
        "state_code": "00",
        "year": "N/A",
        "message": "FSSAI licence must be exactly 14 digits as per FSS (Licensing and Registration) Reg 2011"
    }

def calculate_food_safety_score(
    storage_condition: str,
    holding_temp_c: float,
    prep_time: datetime,
    pack_time: datetime,
    visual_pass: bool = True,
    smell_texture_pass: bool = True,
    packaging_integrity_pass: bool = True,
    clean_vessels_pass: bool = True,
    handler_hygiene_pass: bool = True,
    allergen_labeled: bool = True,
    now: datetime = None
) -> Tuple[float, Dict[str, Any]]:
    """
    Calculates the 0-100 Food Safety Confidence Score according to FSSAI 2019 guidelines:
    - Temperature Compliance (40 points max)
    - Time Decay / Elapsed Freshness (25 points max)
    - Physical Sensory & Packaging Check (20 points max)
    - Hygiene & Handling Protocol (10 points max)
    - Allergen Declaration (5 points max)
    """
    if now is None:
        now = datetime.utcnow()

    breakdown = {}
    is_disqualified = False
    disqualify_reason = ""

    # 1. Temperature Compliance (40 pts)
    temp_score = 0.0
    if storage_condition == "hot_holding":
        if holding_temp_c >= MIN_HOT_HOLDING_TEMP_C:
            temp_score = 40.0
        elif holding_temp_c >= 55.0:
            temp_score = 25.0
            breakdown["temp_warning"] = "Below 60°C threshold. Must be consumed immediately (<1h) or rejected."
        else:
            temp_score = 0.0
            is_disqualified = True
            disqualify_reason = f"Hot food temperature ({holding_temp_c}°C) fell into Danger Zone (<55°C). Bacterial growth hazard."
    elif storage_condition == "refrigerated":
        if holding_temp_c <= MAX_COLD_HOLDING_TEMP_C:
            temp_score = 40.0
        elif holding_temp_c <= 8.0:
            temp_score = 20.0
            breakdown["temp_warning"] = "Chilled holding elevated (5-8°C). Rapid distribution required."
        else:
            temp_score = 0.0
            is_disqualified = True
            disqualify_reason = f"Chilled food temperature ({holding_temp_c}°C) exceeds safe cold chain ceiling (5°C)."
    else:  # sealed ambient / bakery / dry
        temp_score = 35.0

    breakdown["temp_points"] = temp_score

    # 2. Time Freshness / Shelf-life Decay (25 pts)
    hours_elapsed = (now - prep_time).total_seconds() / 3600.0
    if hours_elapsed < 0:
        hours_elapsed = 0.0

    if storage_condition == "hot_holding":
        max_allowed_hours = MAX_HOT_ROOM_TEMP_HOURS
    elif storage_condition == "refrigerated":
        max_allowed_hours = 24.0
    else:
        max_allowed_hours = 12.0

    if hours_elapsed > max_allowed_hours:
        time_score = 0.0
        is_disqualified = True
        disqualify_reason = f"Elapsed time since preparation ({hours_elapsed:.1f}h) exceeds FSSAI safety window ({max_allowed_hours}h)."
    else:
        remaining_ratio = max(0.0, (max_allowed_hours - hours_elapsed) / max_allowed_hours)
        time_score = round(remaining_ratio * 25.0, 1)

    breakdown["time_points"] = time_score
    breakdown["hours_elapsed"] = round(hours_elapsed, 1)

    # 3. Sensory & Physical Integrity (20 pts)
    sensory_score = 0.0
    if not visual_pass or not smell_texture_pass:
        is_disqualified = True
        disqualify_reason = "Sensory failure: off-odor, abnormal discoloration, or souring detected."
    else:
        sensory_score += 10.0
    if packaging_integrity_pass:
        sensory_score += 10.0
    else:
        sensory_score += 0.0
        breakdown["packaging_warning"] = "Damaged or open seal detected."

    breakdown["sensory_points"] = sensory_score

    # 4. Hygiene & Clean Vessel Compliance (10 pts)
    hygiene_score = 0.0
    if handler_hygiene_pass:
        hygiene_score += 5.0
    if clean_vessels_pass:
        hygiene_score += 5.0
    breakdown["hygiene_points"] = hygiene_score

    # 5. Allergen & Ingredient Transparency (5 pts)
    allergen_score = 5.0 if allergen_labeled else 0.0
    breakdown["allergen_points"] = allergen_score

    total_score = temp_score + time_score + sensory_score + hygiene_score + allergen_score

    if is_disqualified:
        total_score = min(total_score, 40.0)
        breakdown["is_disqualified"] = True
        breakdown["disqualify_reason"] = disqualify_reason
    else:
        breakdown["is_disqualified"] = False

    return round(total_score, 1), breakdown

def check_consumption_window(prep_time: datetime, storage_condition: str) -> datetime:
    """Computes exact expiry time based on storage condition."""
    if storage_condition == "hot_holding":
        return prep_time + timedelta(hours=DEFAULT_HOT_CONSUMPTION_WINDOW)
    elif storage_condition == "refrigerated":
        return prep_time + timedelta(hours=24.0)
    else:
        return prep_time + timedelta(hours=8.0)
