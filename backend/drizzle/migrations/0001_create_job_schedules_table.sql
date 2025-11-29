CREATE TABLE "job_schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"job_name" text NOT NULL,
	"cron_expression" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "job_schedules_job_name_unique" UNIQUE("job_name")
);
