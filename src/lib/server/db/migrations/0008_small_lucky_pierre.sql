DROP TABLE "partner_product_request";--> statement-breakpoint
ALTER TABLE "partner_product" DROP CONSTRAINT "partner_product_partner_id_product_id_unique";--> statement-breakpoint
ALTER TABLE "partner_product" ADD COLUMN "status" "partner_product_request_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "partner_product" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "partner_product" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;