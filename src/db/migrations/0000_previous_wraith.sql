CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"hash" text NOT NULL,
	"os" text NOT NULL,
	"ip" text,
	"browser" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "sessions_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"auth_id" text,
	"avatar" text,
	"name" varchar(15) NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"deleted_at" timestamp,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "expires_at_idx" ON "sessions" USING btree ("expires_at");