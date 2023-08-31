CREATE TABLE IF NOT EXISTS "chat_room_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatRoomId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"messageType" varchar(20) NOT NULL,
	"message" varchar DEFAULT '' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_room_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatRoomId" uuid NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizationId" uuid,
	"lunchGroupId" uuid,
	"lunchGroupPollId" uuid
);
--> statement-breakpoint
ALTER TABLE "lunch_group_polls" ALTER COLUMN "meetingTime" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_room_messages" ADD CONSTRAINT "chat_room_messages_chatRoomId_chat_rooms_id_fk" FOREIGN KEY ("chatRoomId") REFERENCES "chat_rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_room_messages" ADD CONSTRAINT "chat_room_messages_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_room_users" ADD CONSTRAINT "chat_room_users_chatRoomId_chat_rooms_id_fk" FOREIGN KEY ("chatRoomId") REFERENCES "chat_rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_room_users" ADD CONSTRAINT "chat_room_users_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_lunchGroupId_lunch_groups_id_fk" FOREIGN KEY ("lunchGroupId") REFERENCES "lunch_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_lunchGroupPollId_lunch_group_polls_id_fk" FOREIGN KEY ("lunchGroupPollId") REFERENCES "lunch_group_polls"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
