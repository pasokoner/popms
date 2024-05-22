ALTER TABLE "partner" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN IF EXISTS "municipality";