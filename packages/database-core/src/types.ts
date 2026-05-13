/**
 * Database types for the core Supabase project.
 *
 * Hand-written for now. Regenerate from the live schema via:
 *   pnpm --filter @gtmstack/database-core gen:types
 * (requires the `supabase` CLI installed + `SUPABASE_CORE_PROJECT_ID` set).
 *
 * The shape matches supabase/core/migrations/20260512_initial.sql exactly.
 */

export type OperatorPlan = "starter" | "growth" | "pro" | "clinical";
export type StorefrontTheme = "wellness" | "clinical" | "community";
export type StorefrontStatus = "draft" | "live" | "paused" | "archived";

export type OrganizationRow = {
  id: string;
  owner_user_id: string;
  name: string;
  slug: string;
  vertical: string | null;
  created_at: string;
};

export type OperatorRow = {
  id: string;
  user_id: string;
  organization_id: string;
  plan: OperatorPlan;
  state: string | null;
  stripe_account_id: string | null;
  brand_name: string | null;
  storefront_slug: string | null;
  onboarded: boolean;
  created_at: string;
};

export type StorefrontRow = {
  id: string;
  organization_id: string;
  slug: string;
  theme: StorefrontTheme;
  brand_voice: BrandVoiceJson | null;
  status: StorefrontStatus;
  created_at: string;
};

/**
 * What we store in the `storefronts.brand_voice` JSONB column. Mirrors
 * `BrandIdentity` from @gtmstack/ai; declared here too to avoid a runtime
 * dependency on @gtmstack/ai inside @gtmstack/database-core.
 */
export type BrandVoiceJson = {
  tagline: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  voiceRegister: string[];
  productPositionings: { slug: string; oneliner: string }[];
  faqDrafts: { question: string; answer: string }[];
};

export type ProductListingRow = {
  id: string;
  storefront_id: string;
  product_slug: string;
  retail_price_cents: number | null;
  enabled: boolean;
  created_at: string;
};

export type EventRow = {
  id: string;
  organization_id: string | null;
  type: string;
  payload: Record<string, unknown>;
  occurred_at: string;
};

// Convenience: the Supabase Database type ssr expects.
// `__InternalSupabase` is required by @supabase/supabase-js >= 2.50 for type
// dispatch — leave it as-is.
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      organizations: {
        Row: OrganizationRow;
        Insert: Omit<OrganizationRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<OrganizationRow>;
      };
      operators: {
        Row: OperatorRow;
        Insert: Omit<OperatorRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<OperatorRow>;
      };
      storefronts: {
        Row: StorefrontRow;
        Insert: Omit<StorefrontRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<StorefrontRow>;
      };
      product_listings: {
        Row: ProductListingRow;
        Insert: Omit<ProductListingRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ProductListingRow>;
      };
      events: {
        Row: EventRow;
        Insert: Omit<EventRow, "id" | "occurred_at"> & {
          id?: string;
          occurred_at?: string;
        };
        Update: Partial<EventRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      operator_plan: OperatorPlan;
      storefront_theme: StorefrontTheme;
      storefront_status: StorefrontStatus;
    };
  };
};
