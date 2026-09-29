from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    full_name: str
    organization_name: str
    is_demo: bool

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: str  # kitchen, ngo, driver, safety_officer, admin
    organization_name: str = ""
    phone_number: str = ""

# Kitchen Onboarding Schemas
class KitchenOnboardingStep1(BaseModel):
    kitchen_name: str
    kitchen_type: str  # hostel, mess, cafeteria, hotel, caterer, hospital

class KitchenOnboardingStep2(BaseModel):
    city: str
    ward: str
    landmark: Optional[str] = ""
    pincode: str
    latitude: Optional[float] = 12.9352
    longitude: Optional[float] = 77.6245

class KitchenOnboardingStep3(BaseModel):
    typical_meals_per_day: int
    breakfast_time: str
    lunch_time: str
    dinner_time: str

class KitchenOnboardingStep4(BaseModel):
    fssai_licence_number: str
    fssai_cert_url: Optional[str] = ""

class MenuItemCreate(BaseModel):
    dish_name: str
    category: str = "main_course"
    unit: str = "kg"
    portion_size_grams: float = 250.0
    cost_per_kg_inr: float = 120.0

class KitchenOnboardingStep5(BaseModel):
    menu_items: List[MenuItemCreate]
    consent_insights_lab: bool = False

# Daily Log Schemas
class DishLogEntry(BaseModel):
    dish_name: str
    prepared_kg: float
    served_kg: float
    leftover_safe_kg: float = 0.0
    discarded_kg: float = 0.0
    discard_reason: str = ""

class DailyLogCreate(BaseModel):
    date: str  # YYYY-MM-DD
    meal_type: str  # breakfast, lunch, snacks, dinner
    expected_headcount: int
    actual_headcount: int
    event_flag: str = "regular"  # regular, exam, festival, holiday, sports_day
    notes: Optional[str] = ""
    dishes: List[DishLogEntry]

class DailyLogUpdate(BaseModel):
    expected_headcount: Optional[int] = None
    actual_headcount: Optional[int] = None
    notes: Optional[str] = None
    dishes: Optional[List[DishLogEntry]] = None

# Inventory Schemas
class InventoryCreate(BaseModel):
    item_name: str
    category: str
    quantity_kg: float
    purchase_date: str
    expiry_date: str
    cost_inr: float = 0.0
    storage_temp_c: float = 4.0

# Temperature Logging Schemas
class TemperatureLogCreate(BaseModel):
    probe_location: str
    temperature_c: float
    sensor_id: Optional[str] = "MANUAL-PROBE"
    source: Optional[str] = "manual"

class IoTSensorTempPush(BaseModel):
    sensor_id: str
    probe_location: str
    temperature_c: float

# Surplus Listing Schemas
class SurplusListingCreate(BaseModel):
    food_title: str
    food_category: str = "cooked_meal"
    quantity_kg: float
    estimated_portions: int
    veg_status: str = "veg"
    prep_time: datetime
    pack_time: datetime
    holding_temp_c: float
    storage_condition: str = "hot_holding"
    allergens_list: List[str] = []
    packaging_type: str = "stainless_steel_camtainer"
    pickup_address: str
    latitude: Optional[float] = 12.9352
    longitude: Optional[float] = 77.6245

# Safety Inspection Schemas
class SafetyInspectionCreate(BaseModel):
    listing_id: int
    decision: str  # approved, rejected, sent_back
    visual_appearance_pass: bool = True
    smell_texture_pass: bool = True
    packaging_integrity_pass: bool = True
    temp_check_c: float
    handler_hygiene_pass: bool = True
    allergen_labeled_pass: bool = True
    clean_vessels_pass: bool = True
    officer_notes: Optional[str] = ""

# NGO & Delivery Schemas
class NgoClaimListing(BaseModel):
    listing_id: int
    beneficiaries_expected: int

class DeliveryVerifyPickup(BaseModel):
    listing_id: int
    qr_token: str
    otp_code: str

class DeliveryVerifyDropoff(BaseModel):
    listing_id: int
    beneficiary_count: int
    notes: Optional[str] = ""

class DeliveryEscalation(BaseModel):
    listing_id: int
    reason: str

# Demand Forecast Request
class ForecastRequest(BaseModel):
    target_date: str
    target_meal: str
    expected_headcount: int
    event_flag: Optional[str] = "regular"
