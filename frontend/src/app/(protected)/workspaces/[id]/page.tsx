"use client";

import { useState, useEffect } from "react";
import { DocumentUpload } from "@/components/document-upload";
import ChatInterface from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { api } from "@/lib/api";
import { ArrowLeft, FileText, MessageSquare, Settings } from "lucide-react";

export default function WorkspacePage({ params }: { params: { id: string } }) {
  const workspaceId = params.id;

  const [chatMode, setChatMode] = useState<"contextual" | "personal">(
    "contextual"
  );
  const [activeTab, setActiveTab] = useState<"chat" | "documents" | "settings">(
    "chat"
  );
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkspaceInfo() {
      try {
        setIsLoading(true);
        const response = await api.get(`/workspaces/${workspaceId}`);
        setWorkspaceName(response.data.name || `Workspace ${workspaceId}`);
      } catch (error) {
        console.error("Erro ao buscar informações do workspace:", error);
        setWorkspaceName(`Workspace ${workspaceId}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkspaceInfo();
  }, [workspaceId]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background mt-15">
      <div className="flex flex-col lg:flex-row gap-8 px-4 w-full max-w-[1800px] mx-auto my-8 h-[calc(100vh-120px)]">
        {/* Sidebar: Navegação e Modos */}
        <aside className="w-full lg:w-1/4 flex flex-col gap-6 max-w-xs">
          <Link
            href="/workspaces"
            className="flex items-center hover:underline gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Workspaces
          </Link>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-4">Navegação</h2>
            <div className="space-y-2">
              <Button
                variant={activeTab === "chat" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveTab("chat")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button
                variant={activeTab === "documents" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveTab("documents")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Documentos
              </Button>
            </div>
          </div>

          {activeTab === "chat" && (
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Modo de Chat</h2>
              <Tabs
                value={chatMode}
                onValueChange={(value) =>
                  setChatMode(value as "contextual" | "personal")
                }
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="contextual">Contextual</TabsTrigger>
                  <TabsTrigger value="personal">Pessoal</TabsTrigger>
                </TabsList>
                <div className="mt-2 text-sm text-muted-foreground">
                  {chatMode === "contextual" ? (
                    <p>
                      Usa o conteúdo dos seus documentos para respostas
                      contextualizadas.
                    </p>
                  ) : (
                    <p>Chat de IA sem usar os documentos como contexto.</p>
                  )}
                </div>
              </Tabs>
            </div>
          )}
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 bg-card rounded-lg shadow-sm p-6 min-h-[80vh]">
          {!isLoading && (
            <>
              {activeTab === "chat" && (
                <div className="h-full">
                  <ChatInterface
                    mode={chatMode}
                    workspaceId={workspaceId}
                    workspaceName={workspaceName}
                  />
                </div>
              )}

              {activeTab === "documents" && (
                <div className="h-full">
                  <h1 className="text-2xl font-bold mb-6">
                    Gerenciar Documentos
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    Adicione documentos que servirão como contexto para a IA
                    responder perguntas. Formatos suportados: PDF, TXT.
                  </p>
                  <DocumentUpload workspaceId={workspaceId} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
