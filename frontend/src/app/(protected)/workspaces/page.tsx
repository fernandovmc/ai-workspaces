"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Trash2, FolderOpen, Loader2, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";

type Workspace = {
  id: string;
  name: string;
};

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();

  const fetchWorkspaces = async () => {
    try {
      const workspacesResponse = await api.get(`/workspaces`);
      setWorkspaces(workspacesResponse.data);
    } catch (workspaceError) {
      console.error("Failed to fetch workspaces:", workspaceError);

      if (axios.isAxiosError(workspaceError)) {
        if (workspaceError.response?.status === 404) {
          console.log("No workspaces found for the user yet");
          setWorkspaces([]);
        } else if (workspaceError.response?.status !== 401) {
          setError("Failed to load workspaces. Please try again.");
        }
      } else {
        setError("Failed to load workspaces. Please try again.");
      }
    }
  };

  useEffect(() => {
    // Ensure this code only runs in the browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");

      if (!token) {
        router.push("/login");
        return;
      }

      // Fetch user information and workspaces in parallel
      const fetchData = async () => {
        try {
          // First try to get user info
          const userResponse = await api.get(`/auth/me`);
          setUser(userResponse.data);

          // Then try to get workspaces
          await fetchWorkspaces();
        } catch (userError) {
          console.error("Failed to fetch user info:", userError);

          if (
            axios.isAxiosError(userError) &&
            userError.response?.status === 401
          ) {
            localStorage.removeItem("jwt");
            router.push("/login");
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [router]);

  const handleDeleteWorkspace = async (workspaceId: string) => {
    setIsDeletingId(workspaceId);

    try {
      await api.delete(`/workspaces/${workspaceId}`);
      // Update the workspaces list after successful deletion
      setWorkspaces(
        workspaces.filter((workspace) => workspace.id !== workspaceId)
      );
      toast.success("Workspace removido com sucesso");
    } catch (error) {
      console.error("Failed to delete workspace:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Sua sessão expirou. Por favor, faça login novamente.");
          localStorage.removeItem("jwt");
          router.push("/login");
        } else {
          toast.error("Erro ao remover workspace. Por favor, tente novamente.");
        }
      } else {
        toast.error("Erro ao remover workspace. Por favor, tente novamente.");
      }
    } finally {
      setIsDeletingId(null);
      setWorkspaceToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 min-h-[60vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-10 flex justify-between items-center mt-20">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus Workspaces</h1>
          {user && (
            <p className="text-sm text-muted-foreground">
              Logado como: {user.email}
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button size="lg" className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Novo Workspace
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Criar workspace</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setPopoverOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor="workspaceName" className="mb-3">Nome do Workspace</Label>
                  <Input
                    id="workspaceName"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Digite o nome do workspace"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPopoverOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!newWorkspaceName.trim()) {
                        toast.error("O nome do workspace não pode estar vazio");
                        return;
                      }
                      setIsCreatingWorkspace(true);
                      try {
                        const response = await api.post("/workspaces", {
                          name: newWorkspaceName,
                        });
                        setWorkspaces([...workspaces, response.data]);
                        setNewWorkspaceName("");
                        setPopoverOpen(false);
                        toast.success("Workspace criado com sucesso");
                      } catch (error) {
                        console.error("Failed to create workspace:", error);
                        toast.error(
                          "Erro ao criar workspace. Por favor, tente novamente."
                        );
                      } finally {
                        setIsCreatingWorkspace(false);
                      }
                    }}
                    disabled={isCreatingWorkspace || !newWorkspaceName.trim()}
                  >
                    {isCreatingWorkspace ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Criar"
                    )}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {workspaces.length === 0 && !error ? (
        <div className="text-center p-10 bg-card rounded-lg border border-dashed border-border shadow-sm">
          <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-xl">Você ainda não tem workspaces</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="hover:shadow-lg transition-shadow overflow-hidden group"
            >
              <Link href={`/workspaces/${workspace.id}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span className="truncate font-extrabold">
                      {workspace.name.toUpperCase()}
                    </span>
                    <Popover 
                      open={workspaceToDelete === workspace.id}
                      onOpenChange={(open) => !open && setWorkspaceToDelete(null)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setWorkspaceToDelete(workspace.id);
                          }}
                          disabled={isDeletingId === workspace.id}
                        >
                          {isDeletingId === workspace.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" align="end">
                        <div className="space-y-3">
                          <h4 className="font-medium">Confirmar exclusão</h4>
                          <p className="text-sm text-muted-foreground">
                            Tem certeza que deseja excluir o workspace <strong>{workspace.name}</strong>?
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setWorkspaceToDelete(null);
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteWorkspace(workspace.id);
                              }}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardTitle>
                </CardHeader>
                <CardFooter className="pt-2 pb-2 text-xs text-muted-foreground">
                  ID: {workspace.id}
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
