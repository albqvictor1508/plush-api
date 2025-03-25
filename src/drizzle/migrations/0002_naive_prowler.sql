ALTER TABLE "users" DROP CONSTRAINT "users_phone_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");