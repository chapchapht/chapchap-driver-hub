import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useDrivers,
  useApproveDriver,
  useRejectDriver,
  useUpdateBalance,
  useDeleteDriver,
  Driver,
} from "@/hooks/useDrivers";
import { FilterTabs } from "@/components/admin/FilterTabs";
import { DriversTable } from "@/components/admin/DriversTable";
import { DriverDetailsSheet } from "@/components/admin/DriverDetailsSheet";
import { UpdateBalanceDialog } from "@/components/admin/UpdateBalanceDialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";
import chapchapLogo from "@/assets/chapchap-logo.png";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [balanceDriver, setBalanceDriver] = useState<Driver | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);

  // Fetch all drivers to calculate counts
  const { data: allDrivers = [], isLoading, refetch } = useDrivers();

  // Filter drivers based on active tab
  const filteredDrivers = useMemo(() => {
    if (activeTab === "all") return allDrivers;
    return allDrivers.filter((d) => d.status === activeTab);
  }, [allDrivers, activeTab]);

  // Calculate counts for tabs
  const counts = useMemo(() => ({
    pending: allDrivers.filter((d) => d.status === "Pending").length,
    active: allDrivers.filter((d) => d.status === "Active").length,
    all: allDrivers.length,
  }), [allDrivers]);

  // Mutations
  const approveMutation = useApproveDriver();
  const rejectMutation = useRejectDriver();
  const updateBalanceMutation = useUpdateBalance();
  const deleteMutation = useDeleteDriver();

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setDetailsOpen(true);
  };

  const handleUpdateBalance = (driver: Driver) => {
    setBalanceDriver(driver);
    setBalanceOpen(true);
  };

  const handleApprove = (driverId: string) => {
    approveMutation.mutate(driverId, {
      onSuccess: () => {
        setDetailsOpen(false);
      },
    });
  };

  const handleReject = (driverId: string) => {
    rejectMutation.mutate(driverId, {
      onSuccess: () => {
        setDetailsOpen(false);
      },
    });
  };

  const handleDelete = (driverId: string) => {
    deleteMutation.mutate(driverId, {
      onSuccess: () => {
        setDetailsOpen(false);
      },
    });
  };

  const handleBalanceConfirm = (amount: number, reason: string) => {
    if (balanceDriver) {
      updateBalanceMutation.mutate(
        { driverId: balanceDriver.id, amount, reason },
        {
          onSuccess: () => {
            setBalanceOpen(false);
            setBalanceDriver(null);
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#001F3F] text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={chapchapLogo} alt="CHAPCHAP" className="h-10 w-auto" />
              <div>
                <h1 className="text-lg font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-xs text-white/70">Driver Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Exit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Filter Tabs */}
        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-2xl font-bold text-yellow-700">{counts.pending}</p>
            <p className="text-sm text-yellow-600">Pending Review</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{counts.active}</p>
            <p className="text-sm text-green-600">Active Drivers</p>
          </div>
          <div className="p-4 bg-card border rounded-lg">
            <p className="text-2xl font-bold">{counts.all}</p>
            <p className="text-sm text-muted-foreground">Total Registered</p>
          </div>
        </div>

        {/* Drivers Table */}
        <DriversTable
          drivers={filteredDrivers}
          onViewDriver={handleViewDriver}
          onUpdateBalance={handleUpdateBalance}
          isLoading={isLoading}
        />
      </main>

      {/* Driver Details Sheet */}
      <DriverDetailsSheet
        driver={selectedDriver}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onUpdateBalance={handleUpdateBalance}
        isApproving={approveMutation.isPending}
        isRejecting={rejectMutation.isPending}
        isDeleting={deleteMutation.isPending}
      />

      {/* Update Balance Dialog */}
      <UpdateBalanceDialog
        driver={balanceDriver}
        open={balanceOpen}
        onOpenChange={setBalanceOpen}
        onConfirm={handleBalanceConfirm}
        isLoading={updateBalanceMutation.isPending}
      />
    </div>
  );
}
