import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export function useOccurrenceTypes() {
  return useQuery({
    queryKey: ["occurrenceTypes"],
    queryFn: async () => {
      const res = await api.get("/occurrences/occurrencetypes");
      return res.data;
    },
  });
}
