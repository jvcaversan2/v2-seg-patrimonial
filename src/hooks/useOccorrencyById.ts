import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export function useOccurrenceById(id?: string) {
  return useQuery({
    queryKey: ["occurrence", id],
    queryFn: async () => {
      const { data } = await api.get(`/occurrences/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
