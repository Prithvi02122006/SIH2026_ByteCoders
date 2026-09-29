"""
Seed Script for Isolated Demo Workspace.
Flags all created records with is_demo=True to strictly isolate them from real user accounts.
"""
from datetime import datetime, timedelta
import json
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models import (
    User, KitchenProfile, NgoProfile, DriverProfile, MenuItem,
    DailyLog, DailyDishLog, InventoryBatch, SurplusListing,
    SafetyInspection, DeliveryRun, TemperatureLog, SensorApiKey
)
from .auth import get_password_hash

DEMO_CREDENTIALS = [
    {
        "role": "kitchen",
        "email": "kitchen.demo@foodloop.in",
        "password": "DemoKitchen@2026",
        "full_name": "Chef Rameshwar Hegde",
        "org_name": "IISc Central Dining Hall & Hostels",
        "phone": "+91 98450 12345"
    },
    {
        "role": "ngo",
        "email": "ngo.demo@foodloop.in",
        "password": "DemoNgo@2026",
        "full_name": "Lakshmi Narayanan",
        "org_name": "Annapoorna Food Rescue Foundation",
        "phone": "+91 98450 67890"
    },
    {
        "role": "driver",
        "email": "driver.demo@foodloop.in",
        "password": "DemoDriver@2026",
        "full_name": "Suresh Kumar",
        "org_name": "FoodLoop Quick-Thermal Logistics",
        "phone": "+91 98450 11223"
    },
    {
        "role": "safety_officer",
        "email": "safety.demo@foodloop.in",
        "password": "DemoSafety@2026",
        "full_name": "Dr. Priya Sharma",
        "org_name": "FSSAI Designated State Inspection Cell",
        "phone": "+91 98450 99887"
    },
    {
        "role": "admin",
        "email": "admin.demo@foodloop.in",
        "password": "DemoAdmin@2026",
        "full_name": "Ananya Sen, ESG Officer",
        "org_name": "Karnataka Higher Education Dining & ESG Directorate",
        "phone": "+91 98450 55443"
    }
]

def seed_demo_workspace():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        existing_demo = db.query(User).filter(User.is_demo == True).first()
        if existing_demo:
            print("Demo workspace already seeded. Skipping.")
            return

        users_by_role = {}
        for cred in DEMO_CREDENTIALS:
            u = User(
                email=cred["email"],
                hashed_password=get_password_hash(cred["password"]),
                full_name=cred["full_name"],
                role=cred["role"],
                organization_name=cred["org_name"],
                phone_number=cred["phone"],
                is_active=True,
                is_demo=True
            )
            db.add(u)
            db.flush()
            users_by_role[cred["role"]] = u

        # Kitchen Profile
        kitchen_user = users_by_role["kitchen"]
        kitchen = KitchenProfile(
            user_id=kitchen_user.id,
            kitchen_name="IISc Central Dining Hall (Mess Block A)",
            kitchen_type="mess",
            city="Bengaluru",
            ward="Ward 35 - Aramane Nagar",
            landmark="Near Department of Aerospace Engineering",
            pincode="560012",
            latitude=13.0219,
            longitude=77.5671,
            typical_meals_per_day=1200,
            breakfast_time="07:30 - 09:30",
            lunch_time="12:30 - 14:30",
            dinner_time="19:30 - 21:30",
            fssai_licence_number="11223344556677",
            fssai_verified=True,
            fssai_status="verified",
            onboarding_step=5,
            onboarding_completed=True,
            consent_insights_lab=True
        )
        db.add(kitchen)
        db.flush()

        # Menu Items
        menu_items = [
            MenuItem(kitchen_id=kitchen.id, dish_name="Sambar & Steamed Ponni Rice", category="staple", portion_size_grams=350, cost_per_kg_inr=85.0),
            MenuItem(kitchen_id=kitchen.id, dish_name="Dal Tadka & Phulka Rotis", category="dal_curry", portion_size_grams=300, cost_per_kg_inr=110.0),
            MenuItem(kitchen_id=kitchen.id, dish_name="Aloo Gobi Matar Sabzi", category="vegetable", portion_size_grams=200, cost_per_kg_inr=95.0),
            MenuItem(kitchen_id=kitchen.id, dish_name="Curd Rice with Tempering", category="dairy_dessert", portion_size_grams=250, cost_per_kg_inr=70.0),
            MenuItem(kitchen_id=kitchen.id, dish_name="Vegetable Pulao & Raita", category="staple", portion_size_grams=350, cost_per_kg_inr=130.0),
            MenuItem(kitchen_id=kitchen.id, dish_name="Mysore Pak (Dessert)", category="dairy_dessert", portion_size_grams=80, cost_per_kg_inr=260.0),
        ]
        db.add_all(menu_items)

        # Inventory Batches (FEFO demo)
        today = datetime.utcnow()
        batches = [
            InventoryBatch(
                kitchen_id=kitchen.id, item_name="Sona Masoori Rice (Grade A)", category="grains",
                quantity_kg=250.0, purchase_date=(today - timedelta(days=10)).strftime("%Y-%m-%d"),
                expiry_date=(today + timedelta(days=90)).strftime("%Y-%m-%d"), cost_inr=12500, storage_temp_c=22.0
            ),
            InventoryBatch(
                kitchen_id=kitchen.id, item_name="Fresh Nandini Milk (Toned)", category="dairy",
                quantity_kg=40.0, purchase_date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
                expiry_date=(today + timedelta(days=2)).strftime("%Y-%m-%d"), cost_inr=2200, storage_temp_c=3.8
            ),
            InventoryBatch(
                kitchen_id=kitchen.id, item_name="Toor Dal (Premium Unpolished)", category="grains",
                quantity_kg=120.0, purchase_date=(today - timedelta(days=20)).strftime("%Y-%m-%d"),
                expiry_date=(today + timedelta(days=180)).strftime("%Y-%m-%d"), cost_inr=19200, storage_temp_c=24.0
            ),
            InventoryBatch(
                kitchen_id=kitchen.id, item_name="Fresh Paneer Blocks", category="dairy",
                quantity_kg=18.0, purchase_date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
                expiry_date=(today + timedelta(days=3)).strftime("%Y-%m-%d"), cost_inr=5940, storage_temp_c=3.2
            )
        ]
        db.add_all(batches)

        # 16 Days of Daily Logs for Kitchen (triggers AI ML GradientBoosting)
        base_date = today - timedelta(days=16)
        for i in range(16):
            log_date = base_date + timedelta(days=i)
            dow = log_date.weekday()
            is_weekend = dow in [5, 6]
            headcount_exp = 950 if is_weekend else 1200
            headcount_act = headcount_exp - (30 if is_weekend else 45)

            daily_log = DailyLog(
                kitchen_id=kitchen.id,
                date=log_date.strftime("%Y-%m-%d"),
                meal_type="lunch",
                expected_headcount=headcount_exp,
                actual_headcount=headcount_act,
                event_flag="regular",
                weather_condition="partly_cloudy",
                notes=f"Routine service day {i+1}"
            )
            db.add(daily_log)
            db.flush()

            # Dishes prepared and served
            prep_rice = 210.0 if not is_weekend else 165.0
            served_rice = prep_rice - 14.0
            safe_rice = 12.0
            discard_rice = 2.0

            prep_dal = 130.0 if not is_weekend else 95.0
            served_dal = prep_dal - 8.0
            safe_dal = 7.0
            discard_dal = 1.0

            prep_sabzi = 110.0 if not is_weekend else 80.0
            served_sabzi = prep_sabzi - 6.0
            safe_sabzi = 5.0
            discard_sabzi = 1.0

            d1 = DailyDishLog(
                daily_log_id=daily_log.id, dish_name="Sambar & Steamed Ponni Rice",
                prepared_kg=prep_rice, served_kg=served_rice, leftover_safe_kg=safe_rice,
                discarded_kg=discard_rice, discard_reason="Plate waste return"
            )
            d2 = DailyDishLog(
                daily_log_id=daily_log.id, dish_name="Dal Tadka & Phulka Rotis",
                prepared_kg=prep_dal, served_kg=served_dal, leftover_safe_kg=safe_dal,
                discarded_kg=discard_dal, discard_reason="Cooking loss"
            )
            d3 = DailyDishLog(
                daily_log_id=daily_log.id, dish_name="Aloo Gobi Matar Sabzi",
                prepared_kg=prep_sabzi, served_kg=served_sabzi, leftover_safe_kg=safe_sabzi,
                discarded_kg=discard_sabzi, discard_reason="Overprep"
            )
            db.add_all([d1, d2, d3])

        # Temperature Logs
        for hr_offset in [5, 4, 3, 2, 1]:
            db.add(TemperatureLog(
                kitchen_id=kitchen.id,
                source="iot_sensor",
                sensor_id="IOT-WELL-01",
                probe_location="hot_holding_well",
                temperature_c=68.5 - hr_offset * 0.4,
                recorded_at=today - timedelta(hours=hr_offset),
                is_alert=False
            ))
            db.add(TemperatureLog(
                kitchen_id=kitchen.id,
                source="iot_sensor",
                sensor_id="IOT-COLD-02",
                probe_location="walk_in_cooler",
                temperature_c=3.6 + hr_offset * 0.1,
                recorded_at=today - timedelta(hours=hr_offset),
                is_alert=False
            ))

        # Sensor API Key
        db.add(SensorApiKey(
            kitchen_id=kitchen.id,
            key_name="Kitchen Steam Kettle Sensor Gateway",
            api_key_hash=get_password_hash("fl_sensor_live_secret_key_iisc_2026"),
            masked_key="fl_sensor_live_...2026",
            is_active=True
        ))

        # NGO Profile
        ngo_user = users_by_role["ngo"]
        ngo = NgoProfile(
            user_id=ngo_user.id,
            org_name="Annapoorna Food Rescue Foundation",
            org_type="food_bank",
            city="Bengaluru",
            ward="Ward 36 - Mathikere",
            fssai_licence_number="21224455667788",
            fssai_verified=True,
            storage_capacity_kg=600.0,
            cold_storage_available=True,
            transport_capacity_kg=350.0,
            reheating_capacity=True,
            beneficiaries_served_daily=850,
            latitude=13.0305,
            longitude=77.5580
        )
        db.add(ngo)
        db.flush()

        # Driver Profile
        driver_user = users_by_role["driver"]
        driver = DriverProfile(
            user_id=driver_user.id,
            vehicle_type="Insulated Electric Van (FSSAI Class B)",
            vehicle_number="KA-04-ER-9012",
            insulated_carrier=True,
            current_lat=13.0250,
            current_lng=77.5620,
            is_available=True
        )
        db.add(driver)
        db.flush()

        # Surplus Listings (Demo workflow records)
        # Listing 1: Approved and Ready for NGO Claim
        l1_prep = today - timedelta(hours=1, minutes=15)
        l1 = SurplusListing(
            kitchen_id=kitchen.id,
            food_title="Fresh Steamed Ponni Rice & Dal Tadka (Cooked Holding Batch)",
            food_category="cooked_meal",
            quantity_kg=38.5,
            estimated_portions=95,
            veg_status="veg",
            prep_time=l1_prep,
            pack_time=l1_prep + timedelta(minutes=20),
            holding_temp_c=67.2,
            storage_condition="hot_holding",
            allergens_list_json=json.dumps(["milk"]),
            consumption_window_hours=3.5,
            expiry_time=l1_prep + timedelta(hours=3, minutes=30),
            packaging_type="food_grade_stainless_steel_camtainer",
            status="approved",
            food_safety_score=94.5,
            safety_notes="Holding temperature verified at 67.2°C. Sensory attributes clear. Packaged in sanitized stainless containers.",
            pickup_address="IISc Central Dining Hall, Kitchen Gate 2, Mathikere Rd, Bengaluru",
            latitude=13.0219,
            longitude=77.5671,
            qr_token="FL-IISc-BATCH-0924-TOKEN",
            otp_code="4892",
            is_demo=True
        )
        db.add(l1)
        db.flush()

        # Safety Inspection for Listing 1
        db.add(SafetyInspection(
            listing_id=l1.id,
            inspector_id=users_by_role["safety_officer"].id,
            inspection_time=today - timedelta(minutes=45),
            decision="approved",
            visual_appearance_pass=True,
            smell_texture_pass=True,
            packaging_integrity_pass=True,
            temp_check_c=67.2,
            temp_compliant=True,
            handler_hygiene_pass=True,
            allergen_labeled_pass=True,
            clean_vessels_pass=True,
            calculated_score=94.5,
            officer_notes="Complies with FSSAI Reg 4(1) hot holding mandate (>60°C). Approved for immediate pickup."
        ))

        # Listing 2: In-Transit with Driver Suresh
        l2_prep = today - timedelta(hours=2)
        l2 = SurplusListing(
            kitchen_id=kitchen.id,
            food_title="Vegetable Pulao & Mix Raita (Insulated Pack)",
            food_category="cooked_meal",
            quantity_kg=24.0,
            estimated_portions=60,
            veg_status="veg",
            prep_time=l2_prep,
            pack_time=l2_prep + timedelta(minutes=15),
            holding_temp_c=64.8,
            storage_condition="hot_holding",
            allergens_list_json=json.dumps(["milk"]),
            consumption_window_hours=3.5,
            expiry_time=l2_prep + timedelta(hours=3, minutes=30),
            packaging_type="insulated_thermal_box",
            status="in_transit",
            food_safety_score=92.0,
            safety_notes="Clean transit box. Driver verified via QR scan at 08:05.",
            pickup_address="IISc Central Dining Hall, Kitchen Gate 2, Mathikere Rd, Bengaluru",
            latitude=13.0219,
            longitude=77.5671,
            qr_token="FL-IISc-BATCH-0922-TOKEN",
            otp_code="3107",
            is_demo=True
        )
        db.add(l2)
        db.flush()

        # Delivery Run for Listing 2
        run2 = DeliveryRun(
            listing_id=l2.id,
            ngo_id=ngo.id,
            driver_id=driver.id,
            claimed_at=today - timedelta(hours=1, minutes=10),
            pickup_eta_minutes=15,
            picked_up_at=today - timedelta(minutes=25),
            delivered_at=None,
            pickup_verified=True,
            dropoff_verified=False,
            beneficiary_count=0,
            status="en_route_dropoff",
            handling_notes="Deliver to Mathikere Shelter distribution center before 09:30 AM."
        )
        db.add(run2)

        # Listing 3: Successfully Delivered earlier today
        l3_prep = today - timedelta(hours=5)
        l3 = SurplusListing(
            kitchen_id=kitchen.id,
            food_title="Idli & Sambar Breakfast Surplus (Hygienic Holding)",
            food_category="cooked_meal",
            quantity_kg=32.0,
            estimated_portions=80,
            veg_status="veg",
            prep_time=l3_prep,
            pack_time=l3_prep + timedelta(minutes=10),
            holding_temp_c=66.0,
            storage_condition="hot_holding",
            allergens_list_json=json.dumps([]),
            consumption_window_hours=3.5,
            expiry_time=l3_prep + timedelta(hours=3, minutes=30),
            packaging_type="food_grade_stainless_steel_camtainer",
            status="delivered",
            food_safety_score=96.0,
            safety_notes="Flawless temperature and rapid distribution.",
            pickup_address="IISc Central Dining Hall, Gate 2",
            latitude=13.0219,
            longitude=77.5671,
            qr_token="FL-IISc-BATCH-0919-TOKEN",
            otp_code="5521",
            is_demo=True
        )
        db.add(l3)
        db.flush()

        run3 = DeliveryRun(
            listing_id=l3.id,
            ngo_id=ngo.id,
            driver_id=driver.id,
            claimed_at=today - timedelta(hours=4),
            pickup_eta_minutes=20,
            picked_up_at=today - timedelta(hours=3, minutes=30),
            delivered_at=today - timedelta(hours=2, minutes=50),
            pickup_verified=True,
            dropoff_verified=True,
            beneficiary_count=80,
            status="delivered",
            handling_notes="Breakfast distribution completed to children and senior citizens."
        )
        db.add(run3)

        # Listing 4: Pending Safety Inspection (waiting for Safety Officer Dr. Priya)
        l4_prep = today - timedelta(minutes=30)
        l4 = SurplusListing(
            kitchen_id=kitchen.id,
            food_title="Paneer Butter Masala & Jeera Rice (Lunch Surplus)",
            food_category="cooked_meal",
            quantity_kg=28.0,
            estimated_portions=70,
            veg_status="veg",
            prep_time=l4_prep,
            pack_time=l4_prep + timedelta(minutes=10),
            holding_temp_c=65.5,
            storage_condition="hot_holding",
            allergens_list_json=json.dumps(["milk", "nuts"]),
            consumption_window_hours=3.5,
            expiry_time=l4_prep + timedelta(hours=3, minutes=30),
            packaging_type="food_grade_stainless_steel_camtainer",
            status="pending_inspection",
            food_safety_score=0.0,
            safety_notes="Awaiting officer inspection.",
            pickup_address="IISc Central Dining Hall, Kitchen Gate 2",
            latitude=13.0219,
            longitude=77.5671,
            qr_token="FL-IISc-BATCH-0925-TOKEN",
            otp_code="8834",
            is_demo=True
        )
        db.add(l4)

        db.commit()
        print("Demo workspace successfully seeded with 5 role accounts!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding demo workspace: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_workspace()
