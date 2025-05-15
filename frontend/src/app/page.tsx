"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Github,
  Code2,
  LayoutGrid,
  ArrowRight,
  FileText,
  BrainCircuit,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleGoToWorkspaces = () => {
    router.push("/workspaces");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center min-h-screen">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-16 w-16" />
            AI <strong className="text-primary">Workspaces</strong>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl">
            Crie workspaces inteligentes para seus documentos e utilize IA
            contextualizada para extrair insights, responder perguntas e
            aumentar sua produtividade.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
            {isLoggedIn ? (
              <Button
                size="lg"
                className="w-full text-md"
                onClick={handleGoToWorkspaces}
              >
                Acessar Meus Workspaces <ArrowRight className="ml-2" />
              </Button>
            ) : (
              <>
                <Input
                  placeholder="Digite seu email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
                <Button className="h-11" size="lg">
                  <Link
                    href="/register"
                    className="flex items-center gap-2"
                    onClick={() => {
                      if (email) {
                        localStorage.setItem("prefilledEmail", email);
                      }
                    }}
                  >
                    Começar <ArrowRight className="" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="mt-8">
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <Link
                href="https://github.com/fernandovmc"
                target="_blank"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                Developed by fernandovmc
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Passos iniciais
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-3">
                <div className="mb-4 rounded-lg bg-muted/20 p-3 w-fit">
                  <LayoutGrid className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Crie um Workspace</h3>
                <p className="text-muted-foreground">
                  Organize seus documentos em workspaces dedicados para
                  diferentes projetos ou áreas de conhecimento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-3">
                <div className="mb-4 rounded-lg bg-muted/20 p-3 w-fit">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  2. Adicione seus Documentos
                </h3>
                <p className="text-muted-foreground">
                  Faça upload de PDFs, arquivos de texto e outros documentos que
                  servirão como contexto para as interações com a IA.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-3">
                <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  3. Interaja com IA Contextualizada
                </h3>
                <p className="text-muted-foreground">
                  Faça perguntas e obtenha respostas baseadas especificamente no
                  conteúdo dos seus documentos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Novidades e Recursos
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-3">
                <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                  <LayoutGrid className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Workspaces Personalizados
                </h3>
                <p className="text-muted-foreground">
                  Organize documentos em diferentes workspaces para criar bases
                  de conhecimento personalizadas para cada projeto ou tema.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-3">
                <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  IA com Contexto Documental
                </h3>
                <p className="text-muted-foreground">
                  Obtenha respostas e insights baseados especificamente no
                  conteúdo dos seus documentos carregados.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-3">
                <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                  <UserCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Acesso Personalizado</h3>
                <p className="text-muted-foreground">
                  Mantenha seus documentos e interações com IA protegidos em sua
                  conta pessoal com acesso quando precisar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            <span className="font-semibold">AI Workspaces</span>
          </div>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <Link
                href="https://github.com/fernandovmc"
                target="_blank"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                Developed by fernandovmc
              </Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
