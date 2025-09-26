CREATE TABLE "files" (
	"id" text PRIMARY KEY NOT NULL,
	"chat_id" text,
	"message_id" text,
	"user_id" text,
	"extension" text NOT NULL,
	"sended_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;