"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      const { data } = await api.post(`/auth/login`, {
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (!data.access_token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("jwt", data.access_token);
      router.push("/workspaces");
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(
        error.response?.data?.message ||
          "Falha no login. Verifique suas credenciais e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 border rounded-lg">
        <div className="flex justify-center mb-4">
          <LogIn className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center">Entre na sua conta</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input name="email" placeholder="Email" type="email" required />
            <div className="relative">
              <Input
                name="password"
                placeholder="Senha"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded text-sm">
              {error}
            </div>
          )}

          <div className="text-center">
            <Link href="/register" className="text-sm hover:underline">
              Não tem uma conta? Registre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
