import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";

interface Occurrence {
  id: number | string;
  location: string;
  date: string; // ISO
  status?: string;
  report: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type Paginated<T> = { data: T[]; meta: Meta };

export function useOccurrences() {
  const accessToken = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [page, setPage] = useState(1);
  const limit = 20;

  const query = useQuery<Paginated<Occurrence>>({
    queryKey: ["occurrences", { page, limit }],
    queryFn: async () => {
      const res = await api.get<Paginated<Occurrence>>("/occurrences", {
        params: { page, limit },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    },
    enabled: !!accessToken && !!user,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { ...query, page, setPage, limit };
}
