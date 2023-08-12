ALTER TABLE "invitations" ALTER COLUMN "emails" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "admin" boolean DEFAULT false NOT NULL;