ALTER TABLE "user" RENAME TO "auth_user";--> statement-breakpoint
ALTER TABLE "auth_user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "department" DROP CONSTRAINT "department_owner_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "partner" DROP CONSTRAINT "partner_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "department" ADD CONSTRAINT "department_owner_id_auth_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partner" ADD CONSTRAINT "partner_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "auth_user" ADD CONSTRAINT "auth_user_email_unique" UNIQUE("email");