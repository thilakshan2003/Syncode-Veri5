-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Verified', 'Not_Verified');

-- CreateEnum
CREATE TYPE "ClinicStaffRole" AS ENUM ('clinic_admin', 'staff');

-- CreateEnum
CREATE TYPE "AppointmentSlotMode" AS ENUM ('online', 'physical');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('booked', 'cancelled', 'completed', 'no_show');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('verified', 'unverified');

-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('pending', 'accepted', 'rejected', 'blocked');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('created', 'paid', 'shipped', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('initiated', 'paid', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('packed', 'shipped', 'delivered');

-- CreateEnum
CREATE TYPE "ResourceCategory" AS ENUM ('SAFE_SEX', 'CONSENT', 'MENTAL_HEALTH', 'SEXUAL_WELLBEING');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "password_hash" VARCHAR(255) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'Not_Verified',
    "gender" VARCHAR,
    "age_range" VARCHAR,
    "preferred_partner_gender" VARCHAR,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinics" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DECIMAL,
    "lng" DECIMAL,
    "available_time" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic_staff" (
    "id" BIGSERIAL NOT NULL,
    "clinic_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role" "ClinicStaffRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinic_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practitioners" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,
    "specialization" VARCHAR NOT NULL,
    "reg_no" VARCHAR,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "experience" INTEGER DEFAULT 0,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practitioners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practitioner_clinics" (
    "id" BIGSERIAL NOT NULL,
    "practitioner_id" BIGINT NOT NULL,
    "clinic_id" BIGINT NOT NULL,

    CONSTRAINT "practitioner_clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_slots" (
    "id" BIGSERIAL NOT NULL,
    "practitioner_id" BIGINT NOT NULL,
    "clinic_id" BIGINT,
    "mode" "AppointmentSlotMode" NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "slot_id" BIGINT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'booked',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_types" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "category" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "test_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_verifications" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "test_type_id" BIGINT NOT NULL,
    "clinic_id" BIGINT,
    "verified_by_user_id" BIGINT,
    "status" "VerificationStatus" NOT NULL,
    "tested_at" DATE,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_current_status" (
    "user_id" BIGINT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'unverified',
    "last_verified_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_current_status_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" BIGSERIAL NOT NULL,
    "shared_by_user_id" BIGINT NOT NULL,
    "received_by_user_id" BIGINT NOT NULL,
    "status" "PartnerStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),
    "user_low" BIGINT,
    "user_high" BIGINT,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_shares" (
    "id" BIGSERIAL NOT NULL,
    "sender_user_id" BIGINT NOT NULL,
    "recipient_user_id" BIGINT,
    "recipient_username_snapshot" VARCHAR(50),
    "token_hash" CHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "viewed_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "max_views" INTEGER NOT NULL DEFAULT 1,
    "view_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "status_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_kits" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "test_kits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "delivery_address" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'created',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "test_kit_id" BIGINT NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit_price_cents" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT,
    "appointment_id" BIGINT,
    "payhere_reference" VARCHAR NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "carrier" VARCHAR,
    "tracking_number" VARCHAR,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'packed',
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "category" "ResourceCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "readTime" TEXT NOT NULL DEFAULT '5 min read',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "clinics_name_idx" ON "clinics"("name");

-- CreateIndex
CREATE INDEX "clinic_staff_user_id_idx" ON "clinic_staff"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "clinic_staff_clinic_id_user_id_key" ON "clinic_staff"("clinic_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "practitioners_user_id_key" ON "practitioners"("user_id");

-- CreateIndex
CREATE INDEX "practitioners_specialization_idx" ON "practitioners"("specialization");

-- CreateIndex
CREATE INDEX "practitioner_clinics_clinic_id_idx" ON "practitioner_clinics"("clinic_id");

-- CreateIndex
CREATE UNIQUE INDEX "practitioner_clinics_practitioner_id_clinic_id_key" ON "practitioner_clinics"("practitioner_id", "clinic_id");

-- CreateIndex
CREATE INDEX "appointment_slots_practitioner_id_starts_at_idx" ON "appointment_slots"("practitioner_id", "starts_at");

-- CreateIndex
CREATE INDEX "appointment_slots_clinic_id_starts_at_idx" ON "appointment_slots"("clinic_id", "starts_at");

-- CreateIndex
CREATE INDEX "appointments_user_id_created_at_idx" ON "appointments"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "appointments_slot_id_idx" ON "appointments"("slot_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_types_name_key" ON "test_types"("name");

-- CreateIndex
CREATE INDEX "test_types_category_idx" ON "test_types"("category");

-- CreateIndex
CREATE INDEX "user_verifications_user_id_created_at_idx" ON "user_verifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "user_verifications_user_id_status_idx" ON "user_verifications"("user_id", "status");

-- CreateIndex
CREATE INDEX "user_verifications_clinic_id_idx" ON "user_verifications"("clinic_id");

-- CreateIndex
CREATE INDEX "partners_shared_by_user_id_idx" ON "partners"("shared_by_user_id");

-- CreateIndex
CREATE INDEX "partners_received_by_user_id_idx" ON "partners"("received_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "partners_user_low_user_high_key" ON "partners"("user_low", "user_high");

-- CreateIndex
CREATE UNIQUE INDEX "status_shares_token_hash_key" ON "status_shares"("token_hash");

-- CreateIndex
CREATE INDEX "status_shares_sender_user_id_created_at_idx" ON "status_shares"("sender_user_id", "created_at");

-- CreateIndex
CREATE INDEX "status_shares_recipient_user_id_created_at_idx" ON "status_shares"("recipient_user_id", "created_at");

-- CreateIndex
CREATE INDEX "orders_user_id_created_at_idx" ON "orders"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payhere_reference_key" ON "payments"("payhere_reference");

-- CreateIndex
CREATE INDEX "payments_order_id_idx" ON "payments"("order_id");

-- CreateIndex
CREATE INDEX "payments_appointment_id_idx" ON "payments"("appointment_id");

-- CreateIndex
CREATE INDEX "shipments_order_id_idx" ON "shipments"("order_id");

-- CreateIndex
CREATE INDEX "Resource_category_idx" ON "Resource"("category");

-- AddForeignKey
ALTER TABLE "clinic_staff" ADD CONSTRAINT "clinic_staff_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_staff" ADD CONSTRAINT "clinic_staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practitioner_clinics" ADD CONSTRAINT "practitioner_clinics_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practitioner_clinics" ADD CONSTRAINT "practitioner_clinics_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "practitioners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_slots" ADD CONSTRAINT "appointment_slots_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_slots" ADD CONSTRAINT "appointment_slots_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "practitioners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "appointment_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_verifications" ADD CONSTRAINT "user_verifications_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_verifications" ADD CONSTRAINT "user_verifications_test_type_id_fkey" FOREIGN KEY ("test_type_id") REFERENCES "test_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_verifications" ADD CONSTRAINT "user_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_verifications" ADD CONSTRAINT "user_verifications_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_current_status" ADD CONSTRAINT "user_current_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_received_by_user_id_fkey" FOREIGN KEY ("received_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_shared_by_user_id_fkey" FOREIGN KEY ("shared_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_shares" ADD CONSTRAINT "status_shares_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_shares" ADD CONSTRAINT "status_shares_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_test_kit_id_fkey" FOREIGN KEY ("test_kit_id") REFERENCES "test_kits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
