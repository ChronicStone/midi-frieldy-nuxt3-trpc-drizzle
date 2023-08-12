CREATE TABLE IF NOT EXISTS "queue_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"queue" varchar NOT NULL,
	"operation" varchar NOT NULL,
	"params" json,
	"result" json,
	"status" varchar(20) DEFAULT 'pending' NOT NULL
);
