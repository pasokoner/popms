DO $$ BEGIN
 CREATE TYPE "partner_product_request_status" AS ENUM('pending', 'accepted', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "partner_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"partner_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	CONSTRAINT "partner_product_partner_id_product_id_unique" UNIQUE("partner_id","product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "partner_product_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"status" "partner_product_request_status" DEFAULT 'pending' NOT NULL,
	"partner_product_id" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN IF EXISTS "price";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partner_product" ADD CONSTRAINT "partner_product_partner_id_partner_id_fk" FOREIGN KEY ("partner_id") REFERENCES "partner"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partner_product" ADD CONSTRAINT "partner_product_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partner_product_request" ADD CONSTRAINT "partner_product_request_partner_product_id_partner_product_id_fk" FOREIGN KEY ("partner_product_id") REFERENCES "partner_product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
