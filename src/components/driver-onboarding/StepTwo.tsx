import { useRef } from "react";
import { Camera, CreditCard, Car, Upload, X, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DocumentFiles {
  idPhoto: File | null;
  licensePlatePhoto: File | null;
  selfieWithId: File | null;
}

interface StepTwoProps {
  documents: DocumentFiles;
  updateDocument: (field: keyof DocumentFiles, file: File | null) => void;
  errors: Record<string, string>;
}

interface UploadCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
}

const UploadCard = ({
  icon,
  label,
  description,
  file,
  onFileChange,
  error,
  required = false,
}: UploadCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div
        onClick={handleClick}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed p-6 transition-all duration-200",
          file
            ? "border-success bg-success/5"
            : error
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-accent hover:bg-accent/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          capture="environment"
        />

        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="rounded-full p-1 hover:bg-destructive/10"
            >
              <X className="h-5 w-5 text-destructive" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-accent/10">
              <Upload className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-accent" />
            </div>
            <p className="text-sm font-medium text-foreground">{description}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Klike oswa pran foto
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

const StepTwo = ({ documents, updateDocument, errors }: StepTwoProps) => {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Dokiman Yo
        </h3>
        <p className="text-sm text-muted-foreground">
          Telechaje foto dokiman ou yo pou verifikasyon sekirite
        </p>
      </div>

      <div className="space-y-4">
        <UploadCard
          icon={<CreditCard className="h-4 w-4 text-accent" />}
          label="Foto Pyès Idantite (CIN/NIF)"
          description="Pran foto pyès idantite ou"
          file={documents.idPhoto}
          onFileChange={(file) => updateDocument("idPhoto", file)}
          error={errors.idPhoto}
          required
        />

        <UploadCard
          icon={<Car className="h-4 w-4 text-accent" />}
          label="Foto Plak Moto/Machin"
          description="Pran foto plak imatikilasyon"
          file={documents.licensePlatePhoto}
          onFileChange={(file) => updateDocument("licensePlatePhoto", file)}
          error={errors.licensePlatePhoto}
          required
        />

        <UploadCard
          icon={<Camera className="h-4 w-4 text-accent" />}
          label="Selfie avèk Pyès Idantite"
          description="Pran yon selfie avèk pyès idantite ou nan men"
          file={documents.selfieWithId}
          onFileChange={(file) => updateDocument("selfieWithId", file)}
          error={errors.selfieWithId}
          required
        />
      </div>

      <div className="rounded-lg bg-secondary/50 p-4">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Sekirite:</strong> Dokiman yo
          konfidansyèl epi n ap itilize yo sèlman pou verifye idantite w.
        </p>
      </div>
    </div>
  );
};

export default StepTwo;
