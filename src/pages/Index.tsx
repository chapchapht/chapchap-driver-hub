import chapchapLogo from "@/assets/chapchap-logo.png";
import DriverOnboardingForm from "@/components/driver-onboarding/DriverOnboardingForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-center px-4">
          <img
            src={chapchapLogo}
            alt="CHAPCHAP Logo"
            className="h-10 w-auto object-contain"
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-8 sm:py-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-lg px-4 text-center sm:px-6">
          <h1 className="mb-3 text-2xl font-bold text-primary-foreground sm:text-3xl">
            Devni Chofè CHAPCHAP
          </h1>
          <p className="text-sm text-primary-foreground/80 sm:text-base">
            Enskri nan kèk minit epi kòmanse fè lajan jodi a
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative -mt-4 pb-12">
        <DriverOnboardingForm />
      </main>

      {/* Footer */}
      <footer className="border-t bg-secondary/30 py-6">
        <div className="mx-auto max-w-lg px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 CHAPCHAP. Tout dwa rezève.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Bezwen èd? Kontakte nou sou WhatsApp
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
