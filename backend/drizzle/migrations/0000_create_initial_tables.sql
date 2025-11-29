CREATE TYPE "public"."agama_enum" AS ENUM('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu', 'Lainnya');--> statement-breakpoint
CREATE TYPE "public"."jenis_kelamin_enum" AS ENUM('L', 'P');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('pending', 'running', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."job_trigger" AS ENUM('cron', 'manual');--> statement-breakpoint
CREATE TABLE "etl_job_log" (
	"id" text PRIMARY KEY NOT NULL,
	"job_name" text NOT NULL,
	"status" "job_status" DEFAULT 'pending' NOT NULL,
	"triggered_by" "job_trigger" NOT NULL,
	"start_time" timestamp with time zone DEFAULT now() NOT NULL,
	"end_time" timestamp with time zone,
	"log_message" text
);
--> statement-breakpoint
CREATE TABLE "aggr_cache" (
	"cache_key" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fact_mahasiswa" (
	"id" text PRIMARY KEY NOT NULL,
	"datahub_mahasiswa_id" text NOT NULL,
	"angkatan" integer,
	"jenis_kelamin" "jenis_kelamin_enum",
	"agama" "agama_enum",
	"tgl_lahir" date,
	"nama_slta" text,
	"nama_jalur_daftar" text,
	"nama_wilayah" text,
	"nama_provinsi" text,
	"datahub_provinsi_id" text,
	"datahub_wilayah_id" text,
	"provinsi_lat" double precision,
	"provinsi_lng" double precision,
	"wilayah_lat" double precision,
	"wilayah_lng" double precision,
	"datahub_updated_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "fact_mahasiswa_datahub_mahasiswa_id_unique" UNIQUE("datahub_mahasiswa_id")
);
--> statement-breakpoint
CREATE INDEX "fact_mhs_angkatan_idx" ON "fact_mahasiswa" USING btree ("angkatan");--> statement-breakpoint
CREATE INDEX "fact_mhs_jenis_kelamin_idx" ON "fact_mahasiswa" USING btree ("jenis_kelamin");--> statement-breakpoint
CREATE INDEX "fact_mhs_agama_idx" ON "fact_mahasiswa" USING btree ("agama");--> statement-breakpoint
CREATE INDEX "fact_mhs_provinsi_id_idx" ON "fact_mahasiswa" USING btree ("datahub_provinsi_id");--> statement-breakpoint
CREATE INDEX "fact_mhs_wilayah_id_idx" ON "fact_mahasiswa" USING btree ("datahub_wilayah_id");--> statement-breakpoint
CREATE INDEX "fact_mhs_provinsi_idx" ON "fact_mahasiswa" USING btree ("nama_provinsi");--> statement-breakpoint
CREATE INDEX "fact_mhs_wilayah_idx" ON "fact_mahasiswa" USING btree ("nama_wilayah");--> statement-breakpoint
CREATE INDEX "fact_mhs_slta_idx" ON "fact_mahasiswa" USING btree ("nama_slta");--> statement-breakpoint
CREATE INDEX "fact_mhs_jalur_idx" ON "fact_mahasiswa" USING btree ("nama_jalur_daftar");--> statement-breakpoint
CREATE INDEX "fact_mhs_updated_at_idx" ON "fact_mahasiswa" USING btree ("datahub_updated_at");