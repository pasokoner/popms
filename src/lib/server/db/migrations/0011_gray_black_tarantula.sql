ALTER TABLE "partner" ALTER COLUMN "municipality" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "partner" ADD CONSTRAINT "partner_name_unique" UNIQUE("name");