-- Add default value for users.id
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
