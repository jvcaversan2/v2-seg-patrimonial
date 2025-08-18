// hooks/useEmitente.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import type { EmitenteFormData } from "../types/types";

export function useEmitente() {
  return useQuery({
    queryKey: ["emitente"],
    queryFn: async () => {
      const res = await api.get("/emitentes/me");
      return res.data;
    },
  });
}

export function useUpdateEmitente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<EmitenteFormData>) => {
      const res = await api.patch("/emitentes/me", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emitente"] });
    },
  });
}
