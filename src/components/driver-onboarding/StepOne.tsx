import { User, Phone, MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  fullName: string;
  whatsappNumber: string;
  homeAddress: string;
  primaryBase: string;
  otherZones: string;
}

interface StepOneProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
  errors: Record<string, string>;
}

const primaryBases = [
  { value: "delmas-32", label: "Delmas 32" },
  { value: "delmas-60", label: "Delmas 60" },
  { value: "petion-ville", label: "Pétion-Ville" },
  { value: "nazon", label: "Nazon" },
  { value: "clercine", label: "Clercine" },
  { value: "carrefour-feuilles", label: "Carrefour-Feuilles" },
];

const StepOne = ({ formData, updateFormData, errors }: StepOneProps) => {
  const validateWhatsApp = (value: string) => {
    // Haiti WhatsApp format validation: +509 followed by 8 digits
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 11) {
      updateFormData("whatsappNumber", value);
    }
  };

  return (
    <div className="animate-fade-up space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Enfòmasyon Pèsonèl
        </h3>
        <p className="text-sm text-muted-foreground">
          Ranpli enfòmasyon ou yo kòrèkteman
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="h-4 w-4 text-accent" />
            Non Konplè
          </Label>
          <Input
            id="fullName"
            placeholder="Jean Baptiste Pierre"
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            className={errors.fullName ? "border-destructive" : ""}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-accent" />
            Nimewo WhatsApp
          </Label>
          <div className="flex">
            <span className="flex items-center rounded-l-lg border border-r-0 bg-secondary px-3 text-sm text-muted-foreground">
              +509
            </span>
            <Input
              id="whatsappNumber"
              placeholder="3456 7890"
              value={formData.whatsappNumber}
              onChange={(e) => validateWhatsApp(e.target.value)}
              className={`rounded-l-none ${errors.whatsappNumber ? "border-destructive" : ""}`}
              maxLength={9}
            />
          </div>
          {errors.whatsappNumber && (
            <p className="text-xs text-destructive">{errors.whatsappNumber}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Fòma: 3456 7890 (8 chif)
          </p>
        </div>

        {/* Home Address */}
        <div className="space-y-2">
          <Label htmlFor="homeAddress" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            Adrès Egzak
          </Label>
          <Input
            id="homeAddress"
            placeholder="123 Rue Capois, Delmas 33"
            value={formData.homeAddress}
            onChange={(e) => updateFormData("homeAddress", e.target.value)}
            className={errors.homeAddress ? "border-destructive" : ""}
          />
          {errors.homeAddress && (
            <p className="text-xs text-destructive">{errors.homeAddress}</p>
          )}
        </div>

        {/* Primary Base */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-accent" />
            Baz Prensipal
          </Label>
          <Select
            value={formData.primaryBase}
            onValueChange={(value) => updateFormData("primaryBase", value)}
          >
            <SelectTrigger className={errors.primaryBase ? "border-destructive" : ""}>
              <SelectValue placeholder="Chwazi baz prensipal ou" />
            </SelectTrigger>
            <SelectContent>
              {primaryBases.map((base) => (
                <SelectItem key={base.value} value={base.value}>
                  {base.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.primaryBase && (
            <p className="text-xs text-destructive">{errors.primaryBase}</p>
          )}
        </div>

        {/* Other Zones */}
        <div className="space-y-2">
          <Label htmlFor="otherZones" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            Lòt Zòn Ou Metrize
          </Label>
          <Textarea
            id="otherZones"
            placeholder="Ex: Tabarre, Croix-des-Bouquets, Bon Repos..."
            value={formData.otherZones}
            onChange={(e) => updateFormData("otherZones", e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Ekri lòt zòn kote ou konn byen (opsyonèl)
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
