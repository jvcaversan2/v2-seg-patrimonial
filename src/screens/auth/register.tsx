import { useState } from "react";
import Group47 from "../../assets/Group 47.svg";
import AuthHeader from "../../components/AuthHeader";
import InputWithIcon from "../../components/InputWithIcon";
import PrimaryButton from "../../components/PrimaryButton";
import AuthFooter from "../../components/AuthFooter";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    alert(`Email: ${email}\nSenha: ${password}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#AFC3D6] to-[#e8f0fa] font-sans px-2">
      <div className="bg-white/90 shadow-2xl rounded-2xl p-8 w-full max-w-md border border-[#e3e8ee]">
        <AuthHeader
          logo={Group47}
          title="Criar conta"
          subtitle="Registre-se para acessar a plataforma"
        />
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-[#484C56] mb-1 font-semibold text-sm"
              htmlFor="email"
            >
              E-mail
            </label>
            <InputWithIcon
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="#2196C9"
                  strokeWidth="2"
                  d="M4 4h16v16H4z"
                  opacity="0"
                />
                <path stroke="#2196C9" strokeWidth="2" d="M4 8l8 5 8-5" />
              </svg>
            </InputWithIcon>
          </div>
          <div>
            <label
              className="block text-[#484C56] mb-1 font-semibold text-sm"
              htmlFor="password"
            >
              Senha
            </label>
            <InputWithIcon
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="8"
                  rx="2"
                  stroke="#2196C9"
                  strokeWidth="2"
                />
                <path
                  stroke="#2196C9"
                  strokeWidth="2"
                  d="M8 11V7a4 4 0 1 1 8 0v4"
                />
              </svg>
            </InputWithIcon>
          </div>
          <div>
            <label
              className="block text-[#484C56] mb-1 font-semibold text-sm"
              htmlFor="confirm-password"
            >
              Confirmar Senha
            </label>
            <InputWithIcon
              id="confirm-password"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="off"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="8"
                  rx="2"
                  stroke="#2196C9"
                  strokeWidth="2"
                />
                <path
                  stroke="#2196C9"
                  strokeWidth="2"
                  d="M8 11V7a4 4 0 1 1 8 0v4"
                />
              </svg>
            </InputWithIcon>
          </div>
          <PrimaryButton type="submit">Registrar</PrimaryButton>
        </form>
        <AuthFooter
          text="Já tem uma conta?"
          linkText="Entrar"
          linkHref="/"
          asLink={false}
        />
      </div>
    </div>
  );
}
