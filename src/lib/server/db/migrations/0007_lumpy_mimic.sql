ALTER TABLE "partner" RENAME COLUMN "user_id" TO "owner_id";--> statement-breakpoint
ALTER TABLE "partner" DROP CONSTRAINT "partner_department_id_user_id_unique";--> statement-breakpoint
ALTER TABLE "partner" DROP CONSTRAINT "partner_user_id_auth_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partner" ADD CONSTRAINT "partner_owner_id_auth_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "partner" ADD CONSTRAINT "partner_department_id_owner_id_unique" UNIQUE("department_id","owner_id");