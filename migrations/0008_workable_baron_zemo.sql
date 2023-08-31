ALTER TABLE "queue_jobs" ALTER COLUMN "result" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "queue_jobs" ALTER COLUMN "result" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "coordinates" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "queue_jobs" ADD COLUMN "defer_job_id" varchar DEFAULT '' NOT NULL;