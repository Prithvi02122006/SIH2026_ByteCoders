from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # 'kitchen', 'ngo', 'driver', 'safety_officer', 'admin'
    organization_name = Column(String(255), default="")
    phone_number = Column(String(50), default="")  # Access controlled, never exposed publicly
    is_active = Column(Boolean, default=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    kitchen_profile = relationship("KitchenProfile", back_populates="user", uselist=False)
    ngo_profile = relationship("NgoProfile", back_populates="user", uselist=False)
    driver_profile = relationship("DriverProfile", back_populates="user", uselist=False)

class KitchenProfile(Base):
    __tablename__ = "kitchen_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    kitchen_name = Column(String(255), nullable=False)
    kitchen_type = Column(String(100), default="mess")  # hostel, mess, cafeteria, hotel, caterer, hospital
    city = Column(String(100), default="Bengaluru")
    ward = Column(String(100), default="Ward 150 - Bellandur")
    landmark = Column(String(255), default="")
    pincode = Column(String(20), default="560103")
    latitude = Column(Float, default=12.9352)
    longitude = Column(Float, default=77.6245)
    typical_meals_per_day = Column(Integer, default=500)
    breakfast_time = Column(String(50), default="07:30 - 09:30")
    lunch_time = Column(String(50), default="12:30 - 14:30")
    dinner_time = Column(String(50), default="19:30 - 21:30")
    fssai_licence_number = Column(String(50), default="")
    fssai_cert_url = Column(String(255), default="")
    fssai_verified = Column(Boolean, default=False)
    fssai_status = Column(String(50), default="unverified")  # unverified, pending_review, verified, rejected
    onboarding_step = Column(Integer, default=1)
    onboarding_completed = Column(Boolean, default=False)
    consent_insights_lab = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="kitchen_profile")
    menu_items = relationship("MenuItem", back_populates="kitchen", cascade="all, delete-orphan")
    daily_logs = relationship("DailyLog", back_populates="kitchen", cascade="all, delete-orphan")
    surplus_listings = relationship("SurplusListing", back_populates="kitchen", cascade="all, delete-orphan")
    inventory_batches = relationship("InventoryBatch", back_populates="kitchen", cascade="all, delete-orphan")
    temperature_logs = relationship("TemperatureLog", back_populates="kitchen", cascade="all, delete-orphan")
    sensor_keys = relationship("SensorApiKey", back_populates="kitchen", cascade="all, delete-orphan")

class NgoProfile(Base):
    __tablename__ = "ngo_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    org_name = Column(String(255), nullable=False)
    org_type = Column(String(100), default="food_bank")  # food_bank, shelter, community_kitchen, orphan_home
    city = Column(String(100), default="Bengaluru")
    ward = Column(String(100), default="Ward 149 - Varthur")
    fssai_licence_number = Column(String(50), default="")
    fssai_verified = Column(Boolean, default=False)
    storage_capacity_kg = Column(Float, default=200.0)
    cold_storage_available = Column(Boolean, default=True)
    transport_capacity_kg = Column(Float, default=150.0)
    reheating_capacity = Column(Boolean, default=True)
    beneficiaries_served_daily = Column(Integer, default=350)
    latitude = Column(Float, default=12.9400)
    longitude = Column(Float, default=77.6300)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ngo_profile")
    delivery_claims = relationship("DeliveryRun", back_populates="ngo")

class DriverProfile(Base):
    __tablename__ = "driver_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    vehicle_type = Column(String(100), default="Thermal Van")  # Thermal Van, Insulated Bike, Auto
    vehicle_number = Column(String(50), default="KA-01-MJ-2024")
    insulated_carrier = Column(Boolean, default=True)
    current_lat = Column(Float, default=12.9360)
    current_lng = Column(Float, default=77.6250)
    is_available = Column(Boolean, default=True)

    user = relationship("User", back_populates="driver_profile")
    assigned_runs = relationship("DeliveryRun", back_populates="driver")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchen_profiles.id"), nullable=False)
    dish_name = Column(String(255), nullable=False)
    category = Column(String(100), default="main_course")  # staple, dal_curry, vegetable, dairy_dessert, bakery, snacks
    unit = Column(String(50), default="kg")
    portion_size_grams = Column(Float, default=250.0)
    cost_per_kg_inr = Column(Float, default=120.0)
    is_active = Column(Boolean, default=True)

    kitchen = relationship("KitchenProfile", back_populates="menu_items")

class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchen_profiles.id"), nullable=False)
    date = Column(String(20), nullable=False)  # YYYY-MM-DD
    meal_type = Column(String(50), nullable=False)  # breakfast, lunch, snacks, dinner
    expected_headcount = Column(Integer, nullable=False)
    actual_headcount = Column(Integer, nullable=False)
    event_flag = Column(String(50), default="regular")  # regular, exam, festival, holiday, sports_day
    weather_condition = Column(String(100), default="clear")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    kitchen = relationship("KitchenProfile", back_populates="daily_logs")
    dish_logs = relationship("DailyDishLog", back_populates="daily_log", cascade="all, delete-orphan")

class DailyDishLog(Base):
    __tablename__ = "daily_dish_logs"

    id = Column(Integer, primary_key=True, index=True)
    daily_log_id = Column(Integer, ForeignKey("daily_logs.id"), nullable=False)
    dish_name = Column(String(255), nullable=False)
    prepared_kg = Column(Float, nullable=False)
    served_kg = Column(Float, nullable=False)
    leftover_safe_kg = Column(Float, default=0.0)
    discarded_kg = Column(Float, default=0.0)
    discard_reason = Column(String(255), default="")  # overproduction, plate_waste, cold_chain, contamination, time_elapsed
    edit_history_json = Column(Text, default="[]")

    daily_log = relationship("DailyLog", back_populates="dish_logs")

class InventoryBatch(Base):
    __tablename__ = "inventory_batches"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchen_profiles.id"), nullable=False)
    item_name = Column(String(255), nullable=False)
    category = Column(String(100), default="produce")  # grains, produce, dairy, bakery, spices
    quantity_kg = Column(Float, nullable=False)
    purchase_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    expiry_date = Column(String(20), nullable=False)    # YYYY-MM-DD
    cost_inr = Column(Float, default=0.0)
    storage_temp_c = Column(Float, default=4.0)

    kitchen = relationship("KitchenProfile", back_populates="inventory_batches")

class SurplusListing(Base):
    __tablename__ = "surplus_listings"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchen_profiles.id"), nullable=False)
    food_title = Column(String(255), nullable=False)
    food_category = Column(String(100), default="cooked_meal")  # cooked_meal, bakery, raw_produce, packaged
    quantity_kg = Column(Float, nullable=False)
    estimated_portions = Column(Integer, nullable=False)
    veg_status = Column(String(20), default="veg")  # veg, non_veg
    prep_time = Column(DateTime, nullable=False)
    pack_time = Column(DateTime, nullable=False)
    holding_temp_c = Column(Float, nullable=False)
    storage_condition = Column(String(100), default="hot_holding")  # hot_holding, refrigerated, sealed_ambient
    allergens_list_json = Column(Text, default="[]")  # e.g. ["milk", "peanuts", "gluten"]
    consumption_window_hours = Column(Float, default=4.0)
    expiry_time = Column(DateTime, nullable=False)
    packaging_type = Column(String(100), default="stainless_steel_camtainer")  # food_grade_ss, pp_containers, seal_bags
    status = Column(String(50), default="pending_inspection")
    # 'pending_inspection', 'approved', 'claimed', 'in_transit', 'delivered', 'rejected', 'expired'
    food_safety_score = Column(Float, default=0.0)
    safety_notes = Column(Text, default="")
    pickup_address = Column(String(255), default="")
    latitude = Column(Float, default=12.9352)
    longitude = Column(Float, default=77.6245)
    qr_token = Column(String(100), default="")
    otp_code = Column(String(10), default="")
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    kitchen = relationship("KitchenProfile", back_populates="surplus_listings")
    inspections = relationship("SafetyInspection", back_populates="listing", cascade="all, delete-orphan")
    delivery_run = relationship("DeliveryRun", back_populates="listing", uselist=False, cascade="all, delete-orphan")

class SafetyInspection(Base):
    __tablename__ = "safety_inspections"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("surplus_listings.id"), nullable=False)
    inspector_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    inspection_time = Column(DateTime, default=datetime.utcnow)
    decision = Column(String(50), nullable=False)  # approved, rejected, sent_back
    visual_appearance_pass = Column(Boolean, default=True)
    smell_texture_pass = Column(Boolean, default=True)
    packaging_integrity_pass = Column(Boolean, default=True)
    temp_check_c = Column(Float, nullable=False)
    temp_compliant = Column(Boolean, default=True)
    handler_hygiene_pass = Column(Boolean, default=True)
    allergen_labeled_pass = Column(Boolean, default=True)
    clean_vessels_pass = Column(Boolean, default=True)
    calculated_score = Column(Float, default=95.0)
    officer_notes = Column(Text, default="")

    listing = relationship("SurplusListing", back_populates="inspections")
    inspector = relationship("User")

class DeliveryRun(Base):
    __tablename__ = "delivery_runs"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("surplus_listings.id"), unique=True, nullable=False)
    ngo_id = Column(Integer, ForeignKey("ngo_profiles.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("driver_profiles.id"), nullable=True)
    claimed_at = Column(DateTime, default=datetime.utcnow)
    pickup_eta_minutes = Column(Integer, default=25)
    picked_up_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    pickup_verified = Column(Boolean, default=False)
    dropoff_verified = Column(Boolean, default=False)
    beneficiary_count = Column(Integer, default=0)
    status = Column(String(50), default="assigned")  # assigned, en_route_pickup, picked_up, en_route_dropoff, delivered, escalated
    escalation_reason = Column(Text, default="")
    handling_notes = Column(Text, default="Maintain thermal container closed. Deliver within 90 minutes.")

    listing = relationship("SurplusListing", back_populates="delivery_run")
    ngo = relationship("NgoProfile", back_populates="delivery_claims")
    driver = relationship("DriverProfile", back_populates="assigned_runs")

class TemperatureLog(Base):
    __tablename__ = "temperature_logs"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchen_profiles.id"), nullable=False)
    source = Column(String(50), default="manual")  # manual, csv_upload, iot_sensor
    sensor_id = Column(String(100), default="MANUAL-PROBE-01")
    probe_location = Column(String(100), default="hot_holding_well")  # hot_holding_well, walk_in_cooler, bain_marie, transport_box
    temperature_c = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    is_alert = Column(Boolean, default=False)

    kitchen = relationship("KitchenProfile", back_populates="temperature_logs")

class SensorApiKey(Base):
    __tablename__ = "sensor_api_keys"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchen_profiles.id"), nullable=False)
    key_name = Column(String(100), default="Kitchen IoT Probe #1")
    api_key_hash = Column(String(255), nullable=False)
    masked_key = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    kitchen = relationship("KitchenProfile", back_populates="sensor_keys")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), default="")
    timestamp = Column(DateTime, default=datetime.utcnow)
    details_json = Column(Text, default="{}")
