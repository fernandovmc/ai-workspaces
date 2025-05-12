"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { Loader2, File, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

export function DocumentUpload({ workspaceId }: { workspaceId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [workspaceId]);

  const fetchDocuments = async () => {
    try {
      const response = await api.get(`/workspaces/${workspaceId}/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error("Erro ao carregar documentos:", error);
    }
  };

  const onDrop = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/workspaces/${workspaceId}/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        },
      });

      fetchDocuments();
      toast.success("Documento enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao enviar documento. Tente novamente.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      await api.delete(`/workspaces/${workspaceId}/documents/${documentId}`);
      
      setDocuments((docs) => docs.filter((doc) => doc.id !== documentId));
      toast.success("Documento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
      toast.error("Erro ao excluir documento. Tente novamente.");
    } finally {
      setDocumentToDelete(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: isUploading,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  const formatFileSize = (bytes: number) => {
    if (!bytes && bytes !== 0) return "Unknown size";
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-180px)] flex flex-col">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isUploading
            ? "bg-primary/5 cursor-not-allowed"
            : "hover:bg-primary/5 cursor-pointer"
        }`}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="space-y-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
            <p className="text-sm font-medium">
              Enviando documento... {uploadProgress}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <FileText className="h-10 w-10 text-primary mx-auto mb-4" />
            <Button variant="outline" className="">
              Adicionar documentos...
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Formatos suportados: PDF, TXT
            </p>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {documents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Documentos ({documents.length})
            </h3>

            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-card rounded-md border"
                >
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.size)} • {formatDate(doc.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Popover open={documentToDelete === doc.id} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocumentToDelete(doc.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="end">
                      <div className="space-y-3">
                        <h4 className="font-medium">Confirmar exclusão</h4>
                        <p className="text-sm text-muted-foreground">
                          Tem certeza que deseja excluir este documento?
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setDocumentToDelete(null)}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteDocument(doc.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
