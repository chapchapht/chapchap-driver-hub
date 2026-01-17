import { Gift, Sparkles } from "lucide-react";

const WelcomeBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-primary p-4 sm:p-6">
      {/* Decorative elements */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-accent/15 blur-xl" />
      
      <div className="relative flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent shadow-orange-glow">
          <Gift className="h-7 w-7 text-accent-foreground" />
        </div>
        
        <div className="text-center sm:text-left">
          <div className="mb-1 flex items-center justify-center gap-2 sm:justify-start">
            <h2 className="text-lg font-bold text-primary-foreground sm:text-xl">
              Bonis Byenvini
            </h2>
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <p className="text-sm text-primary-foreground/90 sm:text-base">
            Enskri jodi a epi resevwa{" "}
            <span className="animate-shimmer inline-block rounded-md bg-accent/20 px-2 py-0.5 font-bold text-accent">
              500 GHT
            </span>{" "}
            sou balans ou gratis pou n kòmanse travay!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
