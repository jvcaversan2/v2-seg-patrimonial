import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export interface RecentOccurrence {
  id: number;
  report: string;
  location: string;
  city: string | null;
  createdAt: string;
  status: string | null;
  unidade: {
    name: string;
  } | null;
}

const fetchRecentOccurrences = async (): Promise<RecentOccurrence[]> => {
  const { data } = await api.get("/occurrences/recent");
  return data;
};

export const useRecentOccurrences = () => {
  return useQuery({
    queryKey: ["recent-occurrences"],
    queryFn: fetchRecentOccurrences,
  });
};
