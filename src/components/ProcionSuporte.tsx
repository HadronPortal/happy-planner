import { useState, useEffect, useCallback, useRef } from "react";
import { Copy, X, Wifi, WifiOff, Paperclip, File, Trash2, Upload } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ConnectionStatus = "initializing" | "connecting" | "connected";

interface AttachedFile {
  name: string;
  size: number;
  file: File;
}

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; colorClass: string; icon: typeof Wifi }> = {
  initializing: { label: "Inicializando", colorClass: "bg-status-idle", icon: WifiOff },
  connecting: { label: "Conectando...", colorClass: "bg-status-connecting", icon: Wifi },
  connected: { label: "Conectado", colorClass: "bg-status-connected", icon: Wifi },
};

function generateSupportId(): string {
  return `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProcionSuporte() {
  const [status, setStatus] = useState<ConnectionStatus>("initializing");
  const [supportId] = useState(() => generateSupportId());
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStatus("connecting"), 1500);
    const t2 = setTimeout(() => setStatus("connected"), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(supportId.replace(/\s/g, ""));
    toast.success("ID copiado para a área de transferência");
  }, [supportId]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: AttachedFile[] = Array.from(files).map((f) => ({
      name: f.name,
      size: f.size,
      file: f,
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} arquivo(s) anexado(s)`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    toast.info("Arquivo removido");
  }, []);

  const handleSendFiles = useCallback(() => {
    if (attachedFiles.length === 0) {
      toast.error("Nenhum arquivo anexado");
      return;
    }
    toast.success(`${attachedFiles.length} arquivo(s) enviado(s) com sucesso`);
    setAttachedFiles([]);
  }, [attachedFiles]);

  const { label, colorClass, icon: StatusIcon } = STATUS_CONFIG[status];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-8 flex items-center justify-center">
          <img src={logoSrc} alt="Hádron Suporte" className="h-16 object-contain" />
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-center gap-2.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${colorClass} ${status !== "connected" ? "animate-pulse-dot" : ""}`} />
            <StatusIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
          </div>

          {/* ID Display */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
              Seu ID de suporte
            </label>
            <div className="rounded-xl border-2 border-border bg-white px-6 py-5 text-center">
              <span className="text-3xl font-mono font-bold tracking-[0.25em] text-foreground">
                {supportId}
              </span>
            </div>
          </div>

          {/* File Attachment */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
              Transferir arquivos
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-border bg-muted/20 px-4 py-4 text-center transition-colors hover:bg-muted/40 cursor-pointer"
            >
              <Paperclip className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">
                Clique para anexar arquivos
              </span>
            </button>

            {attachedFiles.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {attachedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2 text-xs">
                    <File className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate flex-1 text-foreground">{f.name}</span>
                    <span className="text-muted-foreground shrink-0">{formatFileSize(f.size)}</span>
                    <button onClick={() => handleRemoveFile(i)} className="text-destructive hover:text-destructive/80 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <Button
                  onClick={handleSendFiles}
                  size="sm"
                  className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-xs"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Enviar {attachedFiles.length} arquivo(s)
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleCopy}
              className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 h-11"
            >
              <Copy className="h-4 w-4" />
              Copiar ID
            </Button>
            <Button
              onClick={() => window.close()}
              className="flex-1 gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-11"
            >
              <X className="h-4 w-4" />
              Fechar
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 px-6 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Aguarde o atendente para iniciar o suporte
          </p>
        </div>
      </div>
    </div>
  );
}
