"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { SendIcon, Bot, User, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function ChatInterface({
  mode,
  workspaceId,
  workspaceName,
}: {
  mode: "contextual" | "personal";
  workspaceId: string;
  workspaceName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, [workspaceId, mode]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/workspaces/${workspaceId}/chat/${mode}`);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar histórico de chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageWithDifferentFormats = async (
    userText: string
  ): Promise<any> => {
    try {
      const payload = { text: userText };

      if (!userText || typeof userText !== "string") {
        throw new Error("Mensagem inválida: deve ser uma string não vazia");
      }

      return await api.post(`/workspaces/${workspaceId}/chat/${mode}`, payload);
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);

      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data
      ) {
        if (
          error.response.data.message &&
          Array.isArray(error.response.data.message)
        ) {
          error.response.data.message.forEach((msg: string) => {
            toast.error(`Erro de validação: ${msg}`);
          });
        } else if (typeof error.response.data.message === "string") {
          toast.error(`Erro: ${error.response.data.message}`);
        }
      }
      throw error;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userText = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      const response = await sendMessageWithDifferentFormats(userText);

      if (response.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: response.data.id || Date.now().toString() + "1",
            role: "assistant",
            content: response.data.content || "Sem resposta clara do servidor.",
            createdAt: response.data.createdAt || new Date().toISOString(),
          },
        ]);
      } else {
        toast.error("Resposta vazia do servidor.");
      }
    } catch (error: any) {
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));

      let errorMessage = "Erro ao enviar mensagem";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Formato de dados inválido.";
            if (error.response.data && error.response.data.message) {
              if (
                Array.isArray(error.response.data.message) &&
                error.response.data.message.length > 0
              ) {
                errorMessage = `Erro: ${error.response.data.message[0]}`;
              } else if (typeof error.response.data.message === "string") {
                errorMessage = `Erro: ${error.response.data.message}`;
              }
            }
            break;
          case 401:
            errorMessage = "Sessão expirada. Por favor, faça login novamente.";
            break;
          case 403:
            errorMessage = "Sem permissão para acessar este recurso.";
            break;
          case 404:
            errorMessage =
              "Endpoint não encontrado. Verifique se o servidor está configurado corretamente.";
            break;
          case 500:
            errorMessage =
              "Erro interno no servidor. O backend pode estar com problemas.";
            break;
          default:
            errorMessage = `Erro ${error.response.status}: ${
              error.response.statusText || "Desconhecido"
            }`;
        }
      } else if (error.request) {
        errorMessage =
          "Sem resposta do servidor. Verifique sua conexão ou se o servidor está rodando.";
      } else {
        errorMessage = `Erro: ${error.message}`;
      }

      toast.error(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="border-b border-primary/20 pb-4 mb-6">
        <h1 className="text-2xl font-bold">
          {(workspaceName || "Workspace").toUpperCase()}
        </h1>
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md mr-2">
            {mode === "contextual" ? "Chat Contextual" : "Chat Pessoal"}
          </span>
          <span>ID: {workspaceId}</span>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto space-y-4 pr-4 mb-4"
        style={{ maxHeight: "calc(100% - 120px)" }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="ml-2">Carregando mensagens...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-card/50 p-6 rounded-lg text-center text-muted-foreground h-full flex flex-col justify-center">
            <Bot className="h-12 w-12 mx-auto mb-4 text-primary/50" />
            <h3 className="text-lg font-medium mb-2">Comece uma conversa</h3>
            <p>
              {mode === "contextual"
                ? "Faça perguntas sobre os documentos deste workspace para obter respostas contextualizadas."
                : "Converse com a IA sem usar contexto de documentos."}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  <span className="text-xs opacity-75">
                    {formatTimestamp(message.createdAt)}
                  </span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border rounded-lg px-4 py-3 max-w-[80%]">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="mt-auto flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
        />
        <Button type="submit" disabled={!input.trim() || isTyping}>
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
