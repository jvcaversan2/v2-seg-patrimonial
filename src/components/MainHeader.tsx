import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Group47 from "../assets/Group 47.svg";
import { useAuthStore } from "@/store/auth";

export default function MainHeader() {
  const [notifications] = useState(3);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 border-b border-green-500/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center">
              <img
                src={Group47}
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Mosaic Fertilizantes
              </h1>
              <p className="text-xs text-green-100">Portal de Segurança</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">
              Sistema Online
            </span>
            <Zap className="h-4 w-4 text-yellow-300" />
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-white hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 border-2 border-white">
                  {notifications}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <User className="h-5 w-5 mr-2" />
                  Admin
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/perfilconfiguracao")} // redireciona
                >
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    logout();
                    setTimeout(() => {
                      navigate("/", { replace: true });
                    }, 0);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
