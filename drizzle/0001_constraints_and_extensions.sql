-- Cross-module foreign keys that the TypeScript schema cannot express without circular imports.
ALTER TABLE "membership_brand_access" ADD CONSTRAINT "membership_brand_access_brand_fk" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "brand_claims" ADD CONSTRAINT "brand_claims_product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "brand_claims" ADD CONSTRAINT "brand_claims_source_asset_fk" FOREIGN KEY ("source_asset_id") REFERENCES "brand_assets"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "brand_guidelines" ADD CONSTRAINT "brand_guidelines_source_asset_fk" FOREIGN KEY ("source_asset_id") REFERENCES "brand_assets"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "brand_assets" ADD CONSTRAINT "brand_assets_product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_identifiers" ADD CONSTRAINT "product_identifiers_marketplace_fk" FOREIGN KEY ("marketplace_id") REFERENCES "marketplaces"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "listing_snapshots" ADD CONSTRAINT "listing_snapshots_job_fk" FOREIGN KEY ("collection_job_id") REFERENCES "collection_jobs"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_parent_fk" FOREIGN KEY ("parent_version_id") REFERENCES "content_versions"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "marketplace_categories" ADD CONSTRAINT "marketplace_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "marketplace_categories"("id") ON DELETE CASCADE;--> statement-breakpoint
-- Guard rails on values the application depends on.
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_brand_scope_chk" CHECK ("brand_scope" IN ('all','restricted'));--> statement-breakpoint
ALTER TABLE "brand_claims" ADD CONSTRAINT "brand_claims_status_chk" CHECK ("status" IN ('approved','unverified','restricted'));--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_trust_chk" CHECK ("trust" IN ('approved','unverified','restricted'));--> statement-breakpoint
ALTER TABLE "skus" ADD CONSTRAINT "skus_pack_quantity_chk" CHECK ("pack_quantity" >= 1);--> statement-breakpoint
ALTER TABLE "internal_quality_scores" ADD CONSTRAINT "internal_quality_scores_range_chk" CHECK ("score" IS NULL OR ("score" >= 0 AND "score" <= 100));--> statement-breakpoint
ALTER TABLE "listing_snapshots" ADD CONSTRAINT "listing_snapshots_outcome_chk" CHECK ("outcome" IN ('observed','not_found','blocked','error'));--> statement-breakpoint
ALTER TABLE "marketplaces" ADD CONSTRAINT "marketplaces_weighted_score_chk" CHECK ("weighted_score" IS NULL OR ("weighted_score" >= 1 AND "weighted_score" <= 5));--> statement-breakpoint
-- The audit log is append-only. Direct UPDATE or DELETE statements are rejected by the database itself;
-- only cascades from deleting a whole organisation or user (trigger depth > 1) are let through.
CREATE OR REPLACE FUNCTION audit_logs_append_only() RETURNS trigger AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'audit_logs is append-only: % is not allowed', TG_OP;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE TRIGGER audit_logs_append_only_trg BEFORE UPDATE OR DELETE ON "audit_logs" FOR EACH ROW EXECUTE FUNCTION audit_logs_append_only();
