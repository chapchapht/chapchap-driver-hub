import { CheckCircle2, Clock, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepThreeProps {
  onNewRegistration: () => void;
}

const StepThree = ({ onNewRegistration }: StepThreeProps) => {
  return (
    <div className="animate-fade-up flex flex-col items-center py-8 text-center">
      {/* Success Icon */}
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-12 w-12 text-success" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent shadow-orange-glow">
          <Gift className="h-4 w-4 text-accent-foreground" />
        </div>
      </div>

      {/* Success Message */}
      <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
        Enskripsyon Anrejistre!
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground sm:text-base">
        Yon ajan ap verifye dokiman w yo pou aktive balans{" "}
        <span className="font-semibold text-accent">500 GHT</span> kado w la.
      </p>

      {/* Status Card */}
      <div className="mb-8 w-full max-w-sm rounded-xl border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Clock className="h-6 w-6 text-accent" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">Verifikasyon ap fèt</p>
            <p className="text-sm text-muted-foreground">
              Delè: 24 - 48 èdtan
            </p>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="w-full max-w-sm space-y-3 rounded-lg bg-secondary/50 p-4 text-left">
        <h4 className="font-medium text-foreground">Sa k ap vin apre:</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            N ap kontakte w sou WhatsApp
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            N ap voye lyen pou telechaje aplikasyon an
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            500 GHT ap parèt nan balans ou
          </li>
        </ul>
      </div>

      {/* New Registration Button */}
      <Button
        variant="outline"
        className="mt-8"
        onClick={onNewRegistration}
      >
        Fè yon lòt enskripsyon
      </Button>
    </div>
  );
};

export default StepThree;
