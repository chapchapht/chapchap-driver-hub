import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Driver } from "@/hooks/useDrivers";

interface UpdateBalanceDialogProps {
  driver: Driver | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (amount: number, reason: string) => void;
  isLoading?: boolean;
}

export function UpdateBalanceDialog({
  driver,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: UpdateBalanceDialogProps) {
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount)) {
      onConfirm(numAmount, reason);
      setAmount("");
      setReason("");
    }
  };

  const handleQuickAmount = (value: number) => {
    if (value === -0.1 && driver) {
      // 10% deduction
      const deduction = Math.round(driver.bonus_amount * -0.1);
      setAmount(deduction.toString());
      setReason("10% commission deduction");
    } else {
      setAmount(value.toString());
    }
  };

  if (!driver) return null;

  const newBalance = driver.bonus_amount + (parseFloat(amount) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Balance</DialogTitle>
          <DialogDescription>
            Adjust balance for {driver.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Current Balance</span>
            <span className="text-lg font-mono font-semibold">
              {driver.bonus_amount} GHT
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (+ to add, - to deduct)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmount(-0.1)}
            >
              -10%
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmount(-50)}
            >
              -50
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmount(100)}
            >
              +100
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmount(500)}
            >
              +500
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              placeholder="e.g., MonCash recharge, commission deduction"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>

          {amount && (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <span className="text-sm font-medium">New Balance</span>
              <span className="text-lg font-mono font-bold text-primary">
                {newBalance} GHT
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!amount || isNaN(parseFloat(amount)) || isLoading}
          >
            {isLoading ? "Updating..." : "Update Balance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
