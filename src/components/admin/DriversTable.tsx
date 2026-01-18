import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Driver } from "@/hooks/useDrivers";
import { Eye, Wallet } from "lucide-react";

interface DriversTableProps {
  drivers: Driver[];
  onViewDriver: (driver: Driver) => void;
  onUpdateBalance: (driver: Driver) => void;
  isLoading?: boolean;
}

export function DriversTable({
  drivers,
  onViewDriver,
  onUpdateBalance,
  isLoading,
}: DriversTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg">No drivers found</p>
        <p className="text-sm">Drivers will appear here once they register</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Zone</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Balance</TableHead>
            <TableHead className="font-semibold text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow
              key={driver.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onViewDriver(driver)}
            >
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{driver.full_name}</span>
                  {driver.driver_id && (
                    <span className="text-xs text-muted-foreground">
                      {driver.driver_id}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{driver.whatsapp_number}</TableCell>
              <TableCell>{driver.primary_zone}</TableCell>
              <TableCell>
                <StatusBadge status={driver.status} />
              </TableCell>
              <TableCell className="text-right font-mono">
                {driver.bonus_amount} GHT
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDriver(driver);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {driver.status === "Active" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateBalance(driver);
                      }}
                    >
                      <Wallet className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
