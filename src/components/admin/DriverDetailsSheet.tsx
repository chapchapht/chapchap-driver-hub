import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import { Driver } from "@/hooks/useDrivers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, Trash2, Wallet, MapPin, Phone, Home, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface DriverDetailsSheetProps {
  driver: Driver | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (driverId: string) => void;
  onReject: (driverId: string) => void;
  onDelete: (driverId: string) => void;
  onUpdateBalance: (driver: Driver) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  isDeleting?: boolean;
}

export function DriverDetailsSheet({
  driver,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onDelete,
  onUpdateBalance,
  isApproving,
  isRejecting,
  isDeleting,
}: DriverDetailsSheetProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!driver) return null;

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value || "—"}</p>
      </div>
    </div>
  );

  const PhotoCard = ({ url, label }: { url: string | null; label: string }) => (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground text-center">{label}</p>
      {url ? (
        <div
          className="aspect-[4/3] rounded-lg overflow-hidden border cursor-pointer hover:ring-2 ring-primary transition-all"
          onClick={() => setSelectedImage(url)}
        >
          <img
            src={url}
            alt={label}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center border">
          <span className="text-xs text-muted-foreground">No photo</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <SheetTitle className="text-xl">{driver.full_name}</SheetTitle>
              <StatusBadge status={driver.status} />
            </div>
            <SheetDescription>
              {driver.driver_id ? (
                <span className="font-mono font-semibold text-primary">{driver.driver_id}</span>
              ) : (
                "Awaiting approval"
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Balance Card */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Bonus Balance</p>
                  <p className="text-2xl font-mono font-bold">{driver.bonus_amount} GHT</p>
                </div>
                {driver.status === "Active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateBalance(driver)}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Update
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <InfoRow icon={Phone} label="WhatsApp" value={driver.whatsapp_number} />
              <InfoRow icon={Home} label="Home Address" value={driver.home_address} />
            </div>

            <Separator />

            {/* Zone Info */}
            <div>
              <h4 className="font-semibold mb-2">Operating Zones</h4>
              <InfoRow icon={MapPin} label="Primary Zone" value={driver.primary_zone} />
              <InfoRow icon={MapPin} label="Other Zones" value={driver.other_zones} />
              {driver.referrer_code && (
                <InfoRow icon={Calendar} label="Referrer Code" value={driver.referrer_code} />
              )}
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <div>
                <span>Registered: </span>
                <span className="font-medium">
                  {format(new Date(driver.created_at), "PPp")}
                </span>
              </div>
            </div>

            <Separator />

            {/* Photos */}
            <div>
              <h4 className="font-semibold mb-3">Verification Documents</h4>
              <div className="grid grid-cols-3 gap-3">
                <PhotoCard url={driver.id_photo_url} label="ID Photo" />
                <PhotoCard url={driver.plate_photo_url} label="License Plate" />
                <PhotoCard url={driver.selfie_photo_url} label="Selfie + ID" />
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              {driver.status === "Pending" && (
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => onApprove(driver.id)}
                    disabled={isApproving}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isApproving ? "Approving..." : "Approve Driver"}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1" disabled={isRejecting}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Driver?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark {driver.full_name}'s application as rejected.
                          They will need to reapply.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => onReject(driver.id)}
                        >
                          Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Driver
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Driver?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {driver.full_name}'s record.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onDelete(driver.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Image Lightbox */}
      <AlertDialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <AlertDialogContent className="max-w-3xl p-2">
          <div className="relative">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Document"
                className="w-full h-auto rounded-lg"
              />
            )}
            <AlertDialogCancel className="absolute top-2 right-2">
              Close
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
