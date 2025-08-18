import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export interface Setor {
  id: number;
  name: string;
  unidadeId?: number;
}

const fetchSetores = async (): Promise<Setor[]> => {
  const { data } = await api.get("/sectors");
  return data;
};

const fetchSetoresByUnidade = async (unidadeId: number): Promise<Setor[]> => {
  const { data } = await api.get(`/sectors/${unidadeId}`);
  return data;
};

export const useSetores = () => {
  return useQuery({
    queryKey: ["setores"],
    queryFn: fetchSetores,
  });
};

export const useSetoresByUnidade = (unidadeId?: number) => {
  return useQuery({
    queryKey: ["setores", "byUnit", unidadeId ?? null],
    queryFn: () => fetchSetoresByUnidade(unidadeId as number),
    enabled: typeof unidadeId === "number" && !Number.isNaN(unidadeId),
  });
};
