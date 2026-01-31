CREATE TABLE "user_profile" (
    "user_id" BIGINT PRIMARY KEY,
    "gender" VARCHAR,
    "age_range" VARCHAR,
    "preferred_partner_gender" VARCHAR,
    "address" TEXT,
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT "user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);
