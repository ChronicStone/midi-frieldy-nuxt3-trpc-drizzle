ALTER TABLE "queue_jobs" ALTER COLUMN "params" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "queue_jobs" ADD COLUMN "attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "queue_jobs" DROP COLUMN IF EXISTS "operation";