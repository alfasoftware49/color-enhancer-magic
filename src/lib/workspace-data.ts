/**
 * Real workspace data — KPI values and module records live in the backend
 * (`workspace_kpis`, `workspace_records`). Readable only by signed-in users.
 */
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/chat/client";
import { hydrateRecords, type CrudRecord } from "@/lib/crud-store";

export type KpiValue = { value: number; deltaPct: number };
export type KpiValues = Record<string, KpiValue>;

export function useWorkspaceKpis(role: string) {
  const query = useQuery({
    queryKey: ["workspace-kpis", role],
    queryFn: async (): Promise<KpiValues> => {
      const { data, error } = await supabase
        .from("workspace_kpis")
        .select("kpi_key, value, delta_pct")
        .eq("role", role);
      if (error) throw error;
      const out: KpiValues = {};
      for (const row of data ?? []) {
        out[row.kpi_key as string] = {
          value: Number(row.value ?? 0),
          deltaPct: Number(row.delta_pct ?? 0),
        };
      }
      return out;
    },
  });

  return { values: query.data ?? {}, loading: query.isLoading };
}

type DbRecord = {
  id: string;
  name: string;
  status: string;
  owner: string;
  category: string;
  amount: number | string;
  occurred_at: string;
  notes: string | null;
  tags: string[] | null;
};

function toCrudRecord(row: DbRecord): CrudRecord {
  return {
    id: row.id,
    name: row.name,
    status: row.status as CrudRecord["status"],
    owner: row.owner,
    category: row.category,
    amount: Number(row.amount ?? 0),
    date: row.occurred_at,
    notes: row.notes ?? "",
    tags: row.tags ?? [],
    comments: [],
    audit: [],
    attachments: [],
    extra: {},
  };
}

/** Loads the real records for a (role, module) pair into the workspace store. */
export function useWorkspaceRecords(role: string, module: string) {
  const query = useQuery({
    queryKey: ["workspace-records", role, module],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_records")
        .select("id, name, status, owner, category, amount, occurred_at, notes, tags")
        .eq("role", role)
        .eq("module", module)
        .order("occurred_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as unknown as DbRecord[]).map(toCrudRecord);
    },
  });

  useEffect(() => {
    if (query.data) hydrateRecords(role, module, query.data);
  }, [query.data, role, module]);

  return { loading: query.isLoading };
}
