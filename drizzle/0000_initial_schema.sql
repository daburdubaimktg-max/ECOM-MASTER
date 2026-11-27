-- Required extensions: pgvector (semantic search) and pg_trgm (fuzzy product matching).
CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"organisation_id" uuid,
	"actor_user_id" uuid,
	"actor_label" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"summary" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role_key" text NOT NULL,
	"brand_scope" text DEFAULT 'all' NOT NULL,
	"brand_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"token_hash" text NOT NULL,
	"invited_by" uuid,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_tokenHash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"ip" text,
	"success" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership_brand_access" (
	"membership_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "membership_brand_access_membership_id_brand_id_pk" PRIMARY KEY("membership_id","brand_id")
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role_key" text NOT NULL,
	"brand_scope" text DEFAULT 'all' NOT NULL,
	"invited_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organisations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organisations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"key" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"rank" integer NOT NULL,
	"is_external" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organisation_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_tokenHash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "brand_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"product_id" uuid,
	"kind" text DEFAULT 'other' NOT NULL,
	"title" text NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"extension" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"sha256" text NOT NULL,
	"storage_key" text NOT NULL,
	"trust_level" text DEFAULT 'unverified' NOT NULL,
	"trust_reviewed_by" uuid,
	"trust_reviewed_at" timestamp with time zone,
	"processing_status" text DEFAULT 'pending' NOT NULL,
	"processing_error" text,
	"page_count" integer,
	"text_chars" integer,
	"chunk_count" integer,
	"image_width" integer,
	"image_height" integer,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"product_id" uuid,
	"claim_text" text NOT NULL,
	"claim_type" text DEFAULT 'benefit' NOT NULL,
	"status" text DEFAULT 'unverified' NOT NULL,
	"restriction_reason" text,
	"market_codes" jsonb,
	"substantiation" text,
	"source_asset_id" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_competitors" (
	"brand_id" uuid NOT NULL,
	"competitor_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "brand_competitors_brand_id_competitor_id_pk" PRIMARY KEY("brand_id","competitor_id")
);
--> statement-breakpoint
CREATE TABLE "brand_guidelines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"section" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"market_codes" jsonb,
	"source_asset_id" uuid,
	"status" text DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"tagline" text,
	"description" text,
	"website" text,
	"positioning" text,
	"personality" text,
	"tone_of_voice" text,
	"target_audience" text,
	"visual_guidelines" text,
	"status" text DEFAULT 'active' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"name" text NOT NULL,
	"parent_company" text,
	"website" text,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"product_id" uuid,
	"source_type" text NOT NULL,
	"source_id" uuid NOT NULL,
	"asset_id" uuid,
	"chunk_index" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"locator" text,
	"page_number" integer,
	"content" text NOT NULL,
	"content_hash" text NOT NULL,
	"trust" text DEFAULT 'unverified' NOT NULL,
	"lang" text DEFAULT 'english' NOT NULL,
	"tsv" "tsvector",
	"embedding" vector(384),
	"embedding_model" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"sku_id" uuid,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"unit" text,
	"locale" text DEFAULT 'en' NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_identifiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"sku_id" uuid NOT NULL,
	"type" text NOT NULL,
	"value" text NOT NULL,
	"normalized_value" text NOT NULL,
	"check_digit_valid" boolean,
	"marketplace_id" uuid,
	"country_code" text,
	"source" text DEFAULT 'manual' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_market_availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"country_code" text NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"sku_id" uuid,
	"asset_id" uuid NOT NULL,
	"role" text DEFAULT 'other' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"size_value" numeric(12, 3),
	"size_unit" text,
	"attributes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"name" text NOT NULL,
	"sub_brand" text,
	"category" text,
	"description" text,
	"benefits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ingredients" text,
	"directions_for_use" text,
	"warnings" text,
	"target_audience" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"sku_code" text NOT NULL,
	"pack_quantity" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_marketplace_presence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"marketplace_id" uuid NOT NULL,
	"presence" text DEFAULT 'unknown' NOT NULL,
	"selling_model" text DEFAULT 'unknown' NOT NULL,
	"notes" text,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"region" text NOT NULL,
	"currency_code" text,
	"languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_initial_market" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country_research" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_code" text NOT NULL,
	"research_date" date NOT NULL,
	"summary" text NOT NULL,
	"key_facts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ranking_method_note" text,
	"is_current" boolean DEFAULT true NOT NULL,
	"import_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"marketplace_id" uuid NOT NULL,
	"parent_id" uuid,
	"external_id" text,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"marketplace_id" uuid NOT NULL,
	"claim" text NOT NULL,
	"metric_type" text,
	"value" text,
	"period" text,
	"nature" text NOT NULL,
	"source_url" text,
	"source_name" text,
	"source_date" text
);
--> statement-breakpoint
CREATE TABLE "marketplace_quality_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"set_id" uuid NOT NULL,
	"official_name" text NOT NULL,
	"what_it_measures" text,
	"components" text,
	"access_method" text,
	"api_reference_url" text,
	"who_can_access" text,
	"source_url" text,
	"verification" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "marketplace_research_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"marketplace_id" uuid NOT NULL,
	"research_date" date NOT NULL,
	"import_id" uuid,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"marketplace_id" uuid NOT NULL,
	"monitoring_status" text DEFAULT 'not_monitored' NOT NULL,
	"notes" text,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"marketplace_id" uuid NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"publisher" text,
	"published_date" text,
	"accessed_date" text
);
--> statement-breakpoint
CREATE TABLE "marketplaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid,
	"slug" text NOT NULL,
	"family_key" text,
	"name" text NOT NULL,
	"country_code" text NOT NULL,
	"region" text NOT NULL,
	"website" text,
	"operator" text,
	"status" text DEFAULT 'active' NOT NULL,
	"platform_category" text NOT NULL,
	"marketplace_type" text NOT NULL,
	"beauty_relevance" text,
	"beauty_relevance_note" text,
	"pharmacy_relevance" text,
	"pharmacy_relevance_note" text,
	"estimated_market_importance" text,
	"market_importance_note" text,
	"competitor_presence_level" text,
	"competitor_presence_note" text,
	"product_coverage_note" text,
	"data_access_method" text,
	"public_seller_api" text,
	"api_note" text,
	"api_docs_url" text,
	"data_collection_feasibility" text,
	"data_collection_feasibility_note" text,
	"priority_scores" jsonb,
	"weighted_score" numeric(4, 2),
	"priority_rank" integer,
	"is_top3" boolean DEFAULT false NOT NULL,
	"priority_rationale" text,
	"confidence" text,
	"confidence_note" text,
	"last_research_date" date,
	"origin" text DEFAULT 'research' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requirement_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"set_id" uuid NOT NULL,
	"rule_key" text NOT NULL,
	"area" text NOT NULL,
	"requirement" text NOT NULL,
	"rule_type" text NOT NULL,
	"value" numeric,
	"unit" text,
	"severity" text NOT NULL,
	"applies_to_country_codes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"applies_to_category" text,
	"seller_type" text,
	"effective_date" text,
	"source_url" text,
	"source_title" text,
	"source_date" text,
	"verification" text NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "requirement_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_key" text NOT NULL,
	"marketplace_name" text NOT NULL,
	"version" integer NOT NULL,
	"status" text DEFAULT 'current' NOT NULL,
	"research_date" date,
	"applies_to_country_codes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category_scope" text,
	"languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"enhanced_content" jsonb,
	"public_documentation_level" text,
	"how_brands_deliver_content" text,
	"non_official_terms" jsonb,
	"limitations" text,
	"import_id" uuid,
	"superseded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"path" text NOT NULL,
	"sha256" text NOT NULL,
	"research_date" date,
	"record_count" integer DEFAULT 0 NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability_observations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"snapshot_id" uuid,
	"observed_at" timestamp with time zone NOT NULL,
	"status" text NOT NULL,
	"raw_text" text,
	"collection_method" text NOT NULL,
	"data_source_id" uuid,
	"data_confidence" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitor_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"competitor_id" uuid NOT NULL,
	"name" text NOT NULL,
	"brand_text" text,
	"category" text,
	"gtin" text,
	"comparable_sku_id" uuid,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"answer_text" text NOT NULL,
	"origin" text NOT NULL,
	"answered_by" text,
	"answered_on" date,
	"approval_status" text,
	"source_chunk_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by" uuid,
	"approved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"external_question_id" text NOT NULL,
	"question_text" text NOT NULL,
	"language" text,
	"asked_on" date,
	"status" text DEFAULT 'unanswered' NOT NULL,
	"topic" text,
	"collected_at" timestamp with time zone NOT NULL,
	"collection_method" text NOT NULL,
	"data_source_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"name" text NOT NULL,
	"method" text NOT NULL,
	"provider" text NOT NULL,
	"status" text DEFAULT 'not_configured' NOT NULL,
	"configuration" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"snapshot_id" uuid,
	"position" integer NOT NULL,
	"role" text NOT NULL,
	"url" text,
	"storage_key" text,
	"width" integer,
	"height" integer,
	"size_bytes" integer,
	"content_hash" text,
	"assessment" jsonb,
	"assessment_data_class" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"collected_at" timestamp with time zone NOT NULL,
	"data_source_id" uuid,
	"collection_method" text NOT NULL,
	"collection_job_id" uuid,
	"data_confidence" text NOT NULL,
	"outcome" text DEFAULT 'observed' NOT NULL,
	"content_hash" text,
	"raw" jsonb NOT NULL,
	"processed" jsonb,
	"processor_version" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"marketplace_id" uuid NOT NULL,
	"external_id" text NOT NULL,
	"url" text,
	"ownership" text DEFAULT 'unknown' NOT NULL,
	"brand_id" uuid,
	"competitor_product_id" uuid,
	"last_known_title" text,
	"last_known_brand_text" text,
	"first_seen_at" timestamp with time zone,
	"last_seen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_observations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"snapshot_id" uuid,
	"observed_at" timestamp with time zone NOT NULL,
	"currency_code" text NOT NULL,
	"list_price" numeric(14, 2),
	"sale_price" numeric(14, 2),
	"promotion_text" text,
	"seller_name" text,
	"collection_method" text NOT NULL,
	"data_source_id" uuid,
	"data_confidence" text NOT NULL,
	"raw" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"marketplace_product_id" uuid NOT NULL,
	"country_code" text NOT NULL,
	"seller_name" text,
	"seller_type" text,
	"monitoring_frequency" text DEFAULT 'weekly' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"data_source_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rating_observations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"snapshot_id" uuid,
	"observed_at" timestamp with time zone NOT NULL,
	"availability" text DEFAULT 'observed' NOT NULL,
	"average_rating" numeric(3, 2),
	"rating_count" integer,
	"review_count" integer,
	"distribution" jsonb,
	"collection_method" text NOT NULL,
	"data_source_id" uuid,
	"data_confidence" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_theme_assignments" (
	"review_id" uuid NOT NULL,
	"theme_id" uuid NOT NULL,
	"polarity" text NOT NULL,
	"excerpt" text,
	"confidence" text,
	"analysis_version" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "review_theme_assignments_review_id_theme_id_pk" PRIMARY KEY("review_id","theme_id")
);
--> statement-breakpoint
CREATE TABLE "review_themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"category_scope" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"external_review_id" text NOT NULL,
	"rating" numeric(2, 1),
	"title" text,
	"body" text,
	"language" text,
	"reviewed_on" date,
	"verified_purchase" boolean,
	"helpful_votes" integer,
	"reviewer_hash" text,
	"sentiment" text,
	"subject" text,
	"analysis_version" text,
	"collected_at" timestamp with time zone NOT NULL,
	"collection_method" text NOT NULL,
	"data_source_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sku_marketplace_matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"sku_id" uuid NOT NULL,
	"marketplace_product_id" uuid NOT NULL,
	"match_method" text NOT NULL,
	"confidence" numeric(4, 3) NOT NULL,
	"status" text DEFAULT 'suggested' NOT NULL,
	"evidence" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"content_version_id" uuid NOT NULL,
	"decision" text NOT NULL,
	"comment" text,
	"decided_by" uuid,
	"decided_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"product_id" uuid,
	"sku_id" uuid,
	"marketplace_id" uuid,
	"country_code" text,
	"language" text DEFAULT 'en' NOT NULL,
	"content_type" text NOT NULL,
	"origin" text NOT NULL,
	"version_number" integer DEFAULT 1 NOT NULL,
	"parent_version_id" uuid,
	"content" jsonb NOT NULL,
	"validation" jsonb,
	"requirement_set_id" uuid,
	"generation" jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "internal_quality_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"snapshot_id" uuid NOT NULL,
	"score_type" text DEFAULT 'internal_lqs' NOT NULL,
	"scoring_rule_id" uuid NOT NULL,
	"requirement_set_id" uuid,
	"score" numeric(5, 2),
	"confidence" text NOT NULL,
	"components" jsonb NOT NULL,
	"inputs_hash" text NOT NULL,
	"calculated_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "official_quality_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"marketplace_id" uuid NOT NULL,
	"signal_name" text NOT NULL,
	"score" numeric(6, 2),
	"score_text" text,
	"components" jsonb,
	"issues" jsonb,
	"suggested_actions" jsonb,
	"observed_at" timestamp with time zone NOT NULL,
	"collection_method" text NOT NULL,
	"data_source_id" uuid,
	"raw" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"brand_id" uuid,
	"product_id" uuid,
	"listing_id" uuid,
	"marketplace_id" uuid,
	"issue_type" text NOT NULL,
	"title" text NOT NULL,
	"issue" text NOT NULL,
	"severity" text NOT NULL,
	"business_importance" text NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"confidence" text NOT NULL,
	"suggested_action" text NOT NULL,
	"expected_benefit" text,
	"estimated_effort" text,
	"responsible_team" text,
	"priority_score" numeric(5, 2),
	"priority_breakdown" jsonb,
	"status" text DEFAULT 'open' NOT NULL,
	"source" text NOT NULL,
	"data_class" text NOT NULL,
	"dedupe_key" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scoring_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid,
	"name" text NOT NULL,
	"score_type" text NOT NULL,
	"version" integer NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"family_key" text,
	"category" text,
	"weights" jsonb NOT NULL,
	"configuration" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"recommendation_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"assignee_user_id" uuid,
	"due_on" date,
	"status" text DEFAULT 'todo' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "automation_workflows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"name" text NOT NULL,
	"workflow_type" text NOT NULL,
	"frequency" text DEFAULT 'weekly' NOT NULL,
	"schedule" text,
	"configuration" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"last_run_at" timestamp with time zone,
	"next_run_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "background_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid,
	"type" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"run_after" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_at" timestamp with time zone,
	"last_error" text,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"workflow_id" uuid,
	"data_source_id" uuid,
	"job_type" text NOT NULL,
	"trigger" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"items_requested" integer DEFAULT 0 NOT NULL,
	"items_succeeded" integer DEFAULT 0 NOT NULL,
	"items_failed" integer DEFAULT 0 NOT NULL,
	"attempt" integer DEFAULT 1 NOT NULL,
	"error" text,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"job_id" uuid NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"context" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"report_type" text NOT NULL,
	"title" text NOT NULL,
	"period_start" date,
	"period_end" date,
	"status" text DEFAULT 'generating' NOT NULL,
	"no_new_data" boolean DEFAULT false NOT NULL,
	"content" jsonb,
	"files" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"generated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_role_key_roles_key_fk" FOREIGN KEY ("role_key") REFERENCES "public"."roles"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_brand_access" ADD CONSTRAINT "membership_brand_access_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_role_key_roles_key_fk" FOREIGN KEY ("role_key") REFERENCES "public"."roles"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_assets" ADD CONSTRAINT "brand_assets_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_assets" ADD CONSTRAINT "brand_assets_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_assets" ADD CONSTRAINT "brand_assets_trust_reviewed_by_users_id_fk" FOREIGN KEY ("trust_reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_assets" ADD CONSTRAINT "brand_assets_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_claims" ADD CONSTRAINT "brand_claims_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_claims" ADD CONSTRAINT "brand_claims_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_claims" ADD CONSTRAINT "brand_claims_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_claims" ADD CONSTRAINT "brand_claims_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_competitors" ADD CONSTRAINT "brand_competitors_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_competitors" ADD CONSTRAINT "brand_competitors_competitor_id_competitors_id_fk" FOREIGN KEY ("competitor_id") REFERENCES "public"."competitors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_guidelines" ADD CONSTRAINT "brand_guidelines_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_guidelines" ADD CONSTRAINT "brand_guidelines_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_guidelines" ADD CONSTRAINT "brand_guidelines_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_guidelines" ADD CONSTRAINT "brand_guidelines_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_asset_id_brand_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."brand_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_identifiers" ADD CONSTRAINT "product_identifiers_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_identifiers" ADD CONSTRAINT "product_identifiers_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_market_availability" ADD CONSTRAINT "product_market_availability_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_market_availability" ADD CONSTRAINT "product_market_availability_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_asset_id_brand_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."brand_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skus" ADD CONSTRAINT "skus_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skus" ADD CONSTRAINT "skus_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skus" ADD CONSTRAINT "skus_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_marketplace_presence" ADD CONSTRAINT "brand_marketplace_presence_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_marketplace_presence" ADD CONSTRAINT "brand_marketplace_presence_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_marketplace_presence" ADD CONSTRAINT "brand_marketplace_presence_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_marketplace_presence" ADD CONSTRAINT "brand_marketplace_presence_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country_research" ADD CONSTRAINT "country_research_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country_research" ADD CONSTRAINT "country_research_import_id_research_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."research_imports"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_categories" ADD CONSTRAINT "marketplace_categories_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_evidence" ADD CONSTRAINT "marketplace_evidence_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_quality_signals" ADD CONSTRAINT "marketplace_quality_signals_set_id_requirement_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."requirement_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_research_snapshots" ADD CONSTRAINT "marketplace_research_snapshots_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_research_snapshots" ADD CONSTRAINT "marketplace_research_snapshots_import_id_research_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."research_imports"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_settings" ADD CONSTRAINT "marketplace_settings_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_settings" ADD CONSTRAINT "marketplace_settings_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_settings" ADD CONSTRAINT "marketplace_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_sources" ADD CONSTRAINT "marketplace_sources_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplaces" ADD CONSTRAINT "marketplaces_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplaces" ADD CONSTRAINT "marketplaces_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplaces" ADD CONSTRAINT "marketplaces_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirement_rules" ADD CONSTRAINT "requirement_rules_set_id_requirement_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."requirement_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirement_sets" ADD CONSTRAINT "requirement_sets_import_id_research_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."research_imports"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_observations" ADD CONSTRAINT "availability_observations_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_observations" ADD CONSTRAINT "availability_observations_listing_id_product_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."product_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_observations" ADD CONSTRAINT "availability_observations_snapshot_id_listing_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."listing_snapshots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_observations" ADD CONSTRAINT "availability_observations_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitor_products" ADD CONSTRAINT "competitor_products_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitor_products" ADD CONSTRAINT "competitor_products_competitor_id_competitors_id_fk" FOREIGN KEY ("competitor_id") REFERENCES "public"."competitors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitor_products" ADD CONSTRAINT "competitor_products_comparable_sku_id_skus_id_fk" FOREIGN KEY ("comparable_sku_id") REFERENCES "public"."skus"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitor_products" ADD CONSTRAINT "competitor_products_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_answers" ADD CONSTRAINT "customer_answers_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_answers" ADD CONSTRAINT "customer_answers_question_id_customer_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."customer_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_answers" ADD CONSTRAINT "customer_answers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_answers" ADD CONSTRAINT "customer_answers_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_questions" ADD CONSTRAINT "customer_questions_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_questions" ADD CONSTRAINT "customer_questions_listing_id_product_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."product_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_questions" ADD CONSTRAINT "customer_questions_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_sources" ADD CONSTRAINT "data_sources_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_listing_id_product_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."product_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_snapshot_id_listing_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."listing_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_snapshots" ADD CONSTRAINT "listing_snapshots_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_snapshots" ADD CONSTRAINT "listing_snapshots_listing_id_product_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."product_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_snapshots" ADD CONSTRAINT "listing_snapshots_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_products" ADD CONSTRAINT "marketplace_products_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_products" ADD CONSTRAINT "marketplace_products_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_products" ADD CONSTRAINT "marketplace_products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_products" ADD CONSTRAINT "marketplace_products_competitor_product_id_competitor_products_id_fk" FOREIGN KEY ("competitor_product_id") REFERENCES "public"."competitor_products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_observations" ADD CONSTRAINT "price_observations_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_observations" ADD CONSTRAINT "price_observations_listing_id_product_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."product_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_observations" ADD CONSTRAINT "price_observations_snapshot_id_listing_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."listing_snapshots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_observations" ADD CONSTRAINT "price_observations_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_listings" ADD CONSTRAINT "product_listings_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_listings" ADD CONSTRAINT "product_listings_marketplace_product_id_marketplace_products_id_fk" FOREIGN KEY ("marketplace_product_id") REFERENCES "public"."marketplace_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_listings" ADD CONSTRAINT "product_listings_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_observations" ADD CONSTRAINT "rating_observations_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_observations" ADD CONSTRAINT "rating_observations_listing_id_product_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."product_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_observations" ADD CONSTRAINT "rating_observations_snapshot_id_listing_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."listing_snapshots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_observations" ADD CONSTRAINT "rating_observations_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_theme_assignments" ADD CONSTRAINT "review_theme_assignments_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_theme_assignments" ADD CONSTRAINT "review_theme_assignments_theme_id_review_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."review_themes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_themes" ADD CONSTRAINT "review_themes_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_listing_id_product_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."product_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sku_marketplace_matches" ADD CONSTRAINT "sku_marketplace_matches_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sku_marketplace_matches" ADD CONSTRAINT "sku_marketplace_matches_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sku_marketplace_matches" ADD CONSTRAINT "sku_marketplace_matches_marketplace_product_id_marketplace_products_id_fk" FOREIGN KEY ("marketplace_product_id") REFERENCES "public"."marketplace_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sku_marketplace_matches" ADD CONSTRAINT "sku_marketplace_matches_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_requirement_set_id_requirement_sets_id_fk" FOREIGN KEY ("requirement_set_id") REFERENCES "public"."requirement_sets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internal_quality_scores" ADD CONSTRAINT "internal_quality_scores_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internal_quality_scores" ADD CONSTRAINT "internal_quality_scores_listing_id_product_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."product_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internal_quality_scores" ADD CONSTRAINT "internal_quality_scores_snapshot_id_listing_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."listing_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internal_quality_scores" ADD CONSTRAINT "internal_quality_scores_scoring_rule_id_scoring_rules_id_fk" FOREIGN KEY ("scoring_rule_id") REFERENCES "public"."scoring_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internal_quality_scores" ADD CONSTRAINT "internal_quality_scores_requirement_set_id_requirement_sets_id_fk" FOREIGN KEY ("requirement_set_id") REFERENCES "public"."requirement_sets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "official_quality_scores" ADD CONSTRAINT "official_quality_scores_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "official_quality_scores" ADD CONSTRAINT "official_quality_scores_listing_id_product_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."product_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "official_quality_scores" ADD CONSTRAINT "official_quality_scores_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "official_quality_scores" ADD CONSTRAINT "official_quality_scores_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_listing_id_product_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."product_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scoring_rules" ADD CONSTRAINT "scoring_rules_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scoring_rules" ADD CONSTRAINT "scoring_rules_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_recommendation_id_recommendations_id_fk" FOREIGN KEY ("recommendation_id") REFERENCES "public"."recommendations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_user_id_users_id_fk" FOREIGN KEY ("assignee_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_workflows" ADD CONSTRAINT "automation_workflows_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_workflows" ADD CONSTRAINT "automation_workflows_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "background_jobs" ADD CONSTRAINT "background_jobs_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_jobs" ADD CONSTRAINT "collection_jobs_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_jobs" ADD CONSTRAINT "collection_jobs_workflow_id_automation_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."automation_workflows"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_jobs" ADD CONSTRAINT "collection_jobs_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_jobs" ADD CONSTRAINT "collection_jobs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_logs" ADD CONSTRAINT "collection_logs_job_id_collection_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."collection_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_generated_by_users_id_fk" FOREIGN KEY ("generated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_org_created_idx" ON "audit_logs" USING btree ("organisation_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "invitations_org_idx" ON "invitations" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "login_attempts_email_idx" ON "login_attempts" USING btree ("email","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_org_user_uq" ON "memberships" USING btree ("organisation_id","user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "brand_assets_brand_idx" ON "brand_assets" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "brand_assets_sha_idx" ON "brand_assets" USING btree ("organisation_id","sha256");--> statement-breakpoint
CREATE INDEX "brand_claims_brand_idx" ON "brand_claims" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "brand_claims_product_idx" ON "brand_claims" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "brand_guidelines_brand_idx" ON "brand_guidelines" USING btree ("brand_id");--> statement-breakpoint
CREATE UNIQUE INDEX "brands_org_slug_uq" ON "brands" USING btree ("organisation_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "competitors_org_name_uq" ON "competitors" USING btree ("organisation_id","name");--> statement-breakpoint
CREATE INDEX "knowledge_chunks_scope_idx" ON "knowledge_chunks" USING btree ("organisation_id","brand_id");--> statement-breakpoint
CREATE INDEX "knowledge_chunks_source_idx" ON "knowledge_chunks" USING btree ("source_type","source_id");--> statement-breakpoint
CREATE INDEX "knowledge_chunks_tsv_idx" ON "knowledge_chunks" USING gin ("tsv");--> statement-breakpoint
CREATE INDEX "product_attributes_product_idx" ON "product_attributes" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_identifiers_sku_idx" ON "product_identifiers" USING btree ("sku_id");--> statement-breakpoint
CREATE INDEX "product_identifiers_lookup_idx" ON "product_identifiers" USING btree ("organisation_id","type","normalized_value");--> statement-breakpoint
CREATE UNIQUE INDEX "product_identifiers_gtin_uq" ON "product_identifiers" USING btree ("organisation_id","normalized_value") WHERE "product_identifiers"."type" = 'gtin';--> statement-breakpoint
CREATE UNIQUE INDEX "product_market_availability_uq" ON "product_market_availability" USING btree ("product_id","country_code");--> statement-breakpoint
CREATE INDEX "product_media_product_idx" ON "product_media" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_variants_product_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "products_org_idx" ON "products" USING btree ("organisation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "skus_org_code_uq" ON "skus" USING btree ("organisation_id","sku_code");--> statement-breakpoint
CREATE INDEX "skus_product_idx" ON "skus" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "brand_marketplace_presence_uq" ON "brand_marketplace_presence" USING btree ("brand_id","marketplace_id");--> statement-breakpoint
CREATE INDEX "country_research_country_idx" ON "country_research" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "marketplace_categories_mp_idx" ON "marketplace_categories" USING btree ("marketplace_id");--> statement-breakpoint
CREATE INDEX "marketplace_evidence_mp_idx" ON "marketplace_evidence" USING btree ("marketplace_id");--> statement-breakpoint
CREATE INDEX "marketplace_quality_signals_set_idx" ON "marketplace_quality_signals" USING btree ("set_id");--> statement-breakpoint
CREATE INDEX "marketplace_research_snapshots_mp_idx" ON "marketplace_research_snapshots" USING btree ("marketplace_id","research_date");--> statement-breakpoint
CREATE UNIQUE INDEX "marketplace_settings_uq" ON "marketplace_settings" USING btree ("organisation_id","marketplace_id");--> statement-breakpoint
CREATE INDEX "marketplace_sources_mp_idx" ON "marketplace_sources" USING btree ("marketplace_id");--> statement-breakpoint
CREATE INDEX "marketplaces_country_idx" ON "marketplaces" USING btree ("country_code");--> statement-breakpoint
CREATE UNIQUE INDEX "marketplaces_reference_uq" ON "marketplaces" USING btree ("country_code","slug") WHERE "marketplaces"."organisation_id" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "marketplaces_org_uq" ON "marketplaces" USING btree ("organisation_id","country_code","slug") WHERE "marketplaces"."organisation_id" is not null;--> statement-breakpoint
CREATE INDEX "requirement_rules_set_idx" ON "requirement_rules" USING btree ("set_id");--> statement-breakpoint
CREATE UNIQUE INDEX "requirement_sets_family_version_uq" ON "requirement_sets" USING btree ("family_key","version");--> statement-breakpoint
CREATE UNIQUE INDEX "research_imports_kind_sha_uq" ON "research_imports" USING btree ("kind","sha256");--> statement-breakpoint
CREATE INDEX "availability_observations_listing_time_idx" ON "availability_observations" USING btree ("listing_id","observed_at");--> statement-breakpoint
CREATE INDEX "competitor_products_competitor_idx" ON "competitor_products" USING btree ("competitor_id");--> statement-breakpoint
CREATE INDEX "customer_answers_question_idx" ON "customer_answers" USING btree ("question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "customer_questions_listing_external_uq" ON "customer_questions" USING btree ("listing_id","external_question_id");--> statement-breakpoint
CREATE INDEX "data_sources_org_idx" ON "data_sources" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "listing_images_listing_idx" ON "listing_images" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "listing_snapshots_listing_time_idx" ON "listing_snapshots" USING btree ("listing_id","collected_at");--> statement-breakpoint
CREATE UNIQUE INDEX "marketplace_products_uq" ON "marketplace_products" USING btree ("organisation_id","marketplace_id","external_id");--> statement-breakpoint
CREATE INDEX "price_observations_listing_time_idx" ON "price_observations" USING btree ("listing_id","observed_at");--> statement-breakpoint
CREATE INDEX "product_listings_mp_product_idx" ON "product_listings" USING btree ("marketplace_product_id");--> statement-breakpoint
CREATE INDEX "rating_observations_listing_time_idx" ON "rating_observations" USING btree ("listing_id","observed_at");--> statement-breakpoint
CREATE INDEX "review_themes_org_idx" ON "review_themes" USING btree ("organisation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_listing_external_uq" ON "reviews" USING btree ("listing_id","external_review_id");--> statement-breakpoint
CREATE INDEX "reviews_listing_date_idx" ON "reviews" USING btree ("listing_id","reviewed_on");--> statement-breakpoint
CREATE UNIQUE INDEX "sku_marketplace_matches_uq" ON "sku_marketplace_matches" USING btree ("sku_id","marketplace_product_id");--> statement-breakpoint
CREATE INDEX "content_approvals_version_idx" ON "content_approvals" USING btree ("content_version_id");--> statement-breakpoint
CREATE INDEX "content_versions_product_idx" ON "content_versions" USING btree ("product_id","marketplace_id");--> statement-breakpoint
CREATE INDEX "internal_quality_scores_listing_idx" ON "internal_quality_scores" USING btree ("listing_id","calculated_at");--> statement-breakpoint
CREATE INDEX "official_quality_scores_listing_idx" ON "official_quality_scores" USING btree ("listing_id","observed_at");--> statement-breakpoint
CREATE INDEX "recommendations_org_status_idx" ON "recommendations" USING btree ("organisation_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "recommendations_dedupe_uq" ON "recommendations" USING btree ("organisation_id","dedupe_key");--> statement-breakpoint
CREATE INDEX "scoring_rules_lookup_idx" ON "scoring_rules" USING btree ("score_type","status");--> statement-breakpoint
CREATE INDEX "tasks_org_status_idx" ON "tasks" USING btree ("organisation_id","status");--> statement-breakpoint
CREATE INDEX "automation_workflows_org_idx" ON "automation_workflows" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "background_jobs_queue_idx" ON "background_jobs" USING btree ("status","run_after");--> statement-breakpoint
CREATE INDEX "collection_jobs_org_created_idx" ON "collection_jobs" USING btree ("organisation_id","created_at");--> statement-breakpoint
CREATE INDEX "collection_logs_job_idx" ON "collection_logs" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "reports_org_created_idx" ON "reports" USING btree ("organisation_id","created_at");