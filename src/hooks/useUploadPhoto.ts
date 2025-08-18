import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/emitentes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: () => {
      // Revalida dados do emitente (se necessário)
      queryClient.invalidateQueries({ queryKey: ["emitente"] });
    },
  });
}
