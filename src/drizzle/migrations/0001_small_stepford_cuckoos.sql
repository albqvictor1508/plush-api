CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"photo_url" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"is_fixed" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "contacts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "chat_type" SET DATA TYPE chat_type;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "file_url" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;