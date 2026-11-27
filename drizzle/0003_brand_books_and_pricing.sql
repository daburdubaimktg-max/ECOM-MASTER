CREATE TABLE "brand_books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"kind" text DEFAULT 'brand_book' NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"launch_date" text,
	"market_codes" jsonb,
	"overview" text,
	"audience" text,
	"key_messages" text,
	"tone_of_voice" text,
	"dos_and_donts" text,
	"fonts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"colours" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"claim_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"asset_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"product_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competitor_products" ADD COLUMN "size_value" numeric(12, 3);--> statement-breakpoint
ALTER TABLE "competitor_products" ADD COLUMN "size_unit" text;--> statement-breakpoint
ALTER TABLE "competitor_products" ADD COLUMN "pack_quantity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_books" ADD CONSTRAINT "brand_books_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_books" ADD CONSTRAINT "brand_books_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_books" ADD CONSTRAINT "brand_books_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_books" ADD CONSTRAINT "brand_books_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "brand_books_brand_idx" ON "brand_books" USING btree ("brand_id");