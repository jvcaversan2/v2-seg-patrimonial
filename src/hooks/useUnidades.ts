// src/hooks/useUnidades.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import type { Unidade } from "@/types/unidade";

const fetchUnidades = async (): Promise<Unidade[]> => {
  const response = await api.get("/unitys");
  return response.data;
};

export const useUnidades = () => {
  return useQuery({
    queryKey: ["unidades"],
    queryFn: fetchUnidades,
  });
};
