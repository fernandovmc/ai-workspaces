"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefilledEmail = localStorage.getItem("prefilledEmail");
      if (prefilledEmail) {
        setEmail(prefilledEmail);
      }
    }
  }, []);

  const validatePassword = (password: string, confirmPassword: string) => {
    if (password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres";
    }
    if (password !== confirmPassword) {
      return "As senhas não conferem";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPasswordError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate passwords match
    const passwordValidationError = validatePassword(password, confirmPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.post(`/auth/register`, {
        email,
        password,
      });

      if (!data.access_token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("jwt", data.access_token);
      router.push("/workspaces");
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError(
        error.response?.data?.message ||
          "Falha no registro. Por favor verifique os dados e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 border rounded-lg">
        <h1 className="text-2xl font-bold text-center">Crie sua conta</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              name="email"
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              name="password"
              placeholder="Senha"
              type="password"
              required
            />
            <Input
              name="confirmPassword"
              placeholder="Confirme sua senha"
              type="password"
              required
            />
            {passwordError && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded text-sm">
                {passwordError}
              </div>
            )}
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar"}
          </Button>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded text-sm">
              {error}
            </div>
          )}

          <div className="text-center">
            <Link href="/login" className="text-sm hover:underline">
              Já tem uma conta? Entre aqui
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
