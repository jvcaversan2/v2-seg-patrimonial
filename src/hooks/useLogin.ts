import { useMutation } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useAuthStore } from "../store/auth";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export function useLogin(onSuccessCallback?: () => void) {
  const login = useAuthStore((s) => s.login);

  return useMutation<LoginResponse, any, LoginInput>({
    mutationFn: async (data) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("onSuccess chamado:", data); // ⬅️ verifique se aparece
      login(data.token);
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Erro ao fazer login.";
      alert(message);
    },
  });
}
