import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressBar from "./ProgressBar";
import WelcomeBanner from "./WelcomeBanner";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { useToast } from "@/hooks/use-toast";
import { uploadDriverDocument, registerDriver } from "@/lib/api";

interface FormData {
  fullName: string;
  whatsappNumber: string;
  homeAddress: string;
  primaryBase: string;
  otherZones: string;
  referrerCode: string;
}

interface DocumentFiles {
  idPhoto: File | null;
  licensePlatePhoto: File | null;
  selfieWithId: File | null;
}

const steps = [
  { label: "Enfòmasyon", description: "Done pèsonèl" },
  { label: "Dokiman", description: "Pyès jistifikatif" },
  { label: "Konfimasyon", description: "Finalize" },
];

const DriverOnboardingForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    whatsappNumber: "",
    homeAddress: "",
    primaryBase: "",
    otherZones: "",
    referrerCode: "",
  });
  const [documents, setDocuments] = useState<DocumentFiles>({
    idPhoto: null,
    licensePlatePhoto: null,
    selfieWithId: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const updateDocument = (field: keyof DocumentFiles, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStepOne = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Non konplè obligatwa";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Non dwe gen omwen 3 karaktè";
    }

    const cleanedNumber = formData.whatsappNumber.replace(/\D/g, "");
    if (!cleanedNumber) {
      newErrors.whatsappNumber = "Nimewo WhatsApp obligatwa";
    } else if (cleanedNumber.length !== 8) {
      newErrors.whatsappNumber = "Nimewo dwe gen 8 chif";
    }

    if (!formData.homeAddress.trim()) {
      newErrors.homeAddress = "Adrès obligatwa";
    }

    if (!formData.primaryBase) {
      newErrors.primaryBase = "Chwazi yon baz prensipal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!documents.idPhoto) {
      newErrors.idPhoto = "Foto pyès idantite obligatwa";
    }

    if (!documents.licensePlatePhoto) {
      newErrors.licensePlatePhoto = "Foto plak obligatwa";
    }

    if (!documents.selfieWithId) {
      newErrors.selfieWithId = "Selfie avèk pyès idantite obligatwa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStepTwo()) return;

    setIsSubmitting(true);

    try {
      // Upload all documents in parallel
      const [idPhotoUrl, platePhotoUrl, selfiePhotoUrl] = await Promise.all([
        uploadDriverDocument(documents.idPhoto!, 'id-photos'),
        uploadDriverDocument(documents.licensePlatePhoto!, 'plate-photos'),
        uploadDriverDocument(documents.selfieWithId!, 'selfie-photos'),
      ]);

      // Format WhatsApp number with country code
      const cleanedNumber = formData.whatsappNumber.replace(/\D/g, "");
      const formattedNumber = `+509${cleanedNumber}`;

      // Submit to edge function
      const result = await registerDriver({
        fullName: formData.fullName,
        whatsappNumber: formattedNumber,
        homeAddress: formData.homeAddress,
        primaryZone: formData.primaryBase,
        otherZones: formData.otherZones || undefined,
        referrerCode: formData.referrerCode || undefined,
        idPhotoUrl,
        platePhotoUrl,
        selfiePhotoUrl,
      });

      if (result.success) {
        setCurrentStep(3);
        toast({
          title: "Siksè!",
          description: result.message || "Enskripsyon ou an soumèt avèk siksè.",
        });
      } else {
        throw new Error(
          Array.isArray(result.details) 
            ? result.details.join(", ") 
            : result.details || result.error || "Registration failed"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Erè",
        description: error instanceof Error ? error.message : "Tanpri eseye ankò pita.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (validateStepOne()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNewRegistration = () => {
    setCurrentStep(1);
    setFormData({
      fullName: "",
      whatsappNumber: "",
      homeAddress: "",
      primaryBase: "",
      otherZones: "",
      referrerCode: "",
    });
    setDocuments({
      idPhoto: null,
      licensePlatePhoto: null,
      selfieWithId: null,
    });
    setErrors({});
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6 sm:px-6 sm:py-8">
      {/* Welcome Banner - Only show on step 1 and 2 */}
      {currentStep < 3 && (
        <div className="mb-6 animate-fade-up">
          <WelcomeBanner />
        </div>
      )}

      {/* Main Card */}
      <div className="rounded-2xl border bg-card shadow-medium">
        {/* Progress Bar */}
        <div className="border-b px-4 sm:px-6">
          <ProgressBar currentStep={currentStep} steps={steps} />
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6">
          {currentStep === 1 && (
            <StepOne
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <StepTwo
              documents={documents}
              updateDocument={updateDocument}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <StepThree onNewRegistration={handleNewRegistration} />
          )}
        </div>

        {/* Navigation Buttons - Only show on step 1 and 2 */}
        {currentStep < 3 && (
          <div className="flex items-center justify-between border-t p-4 sm:p-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retounen
            </Button>

            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="gap-2 bg-accent text-accent-foreground shadow-orange-glow hover:bg-orange-dark"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ap soumèt...
                </>
              ) : currentStep === 2 ? (
                "Soumèt"
              ) : (
                <>
                  Kontinye
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverOnboardingForm;
