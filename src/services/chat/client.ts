/**
 * Chat Supabase client.
 *
 * The project aliases `@/integrations/supabase/client` to a legacy-schema
 * compat wrapper. The chat module needs the real generated schema types, so it
 * imports the generated client directly through this module.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase as generatedSupabase } from "../../integrations/supabase/client";
import type { Database } from "../../integrations/supabase/types";

export const supabase = generatedSupabase as unknown as SupabaseClient<Database>;
export type { Database };
export default supabase;
