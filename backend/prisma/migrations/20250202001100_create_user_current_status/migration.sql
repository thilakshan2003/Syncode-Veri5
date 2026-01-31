CREATE TABLE "user_current_status" (
    "user_id" BIGINT PRIMARY KEY,
    "status" "VerificationStatus" NOT NULL DEFAULT 'unverified',
    "last_verified_at" TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT "user_current_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);
