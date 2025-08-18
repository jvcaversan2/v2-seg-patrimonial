// hooks/useOccurrenceFlags.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useAuthStore } from "@/store/auth";

export function useOccurrenceFlags() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["occurrence-flags"],
    queryFn: async () =>
      (
        await api.get("/lookups/occurrence-flags", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data as {
        securityActions: { id: number; name: string }[];
        aggravatingSituations: { id: number; name: string }[];
      },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}
