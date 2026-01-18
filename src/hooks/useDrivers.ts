import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDrivers,
  approveDriver,
  rejectDriver,
  updateDriverBalance,
  deleteDriver,
  Driver,
} from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";

export function useDrivers(status?: string) {
  return useQuery({
    queryKey: ["drivers", status],
    queryFn: () => fetchDrivers(status),
    staleTime: 30000, // 30 seconds
  });
}

export function useApproveDriver() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: approveDriver,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast({
        title: "Driver Approved",
        description: `${data.full_name} has been approved with ID ${data.driver_id}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRejectDriver() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: rejectDriver,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast({
        title: "Driver Rejected",
        description: `${data.full_name} has been rejected`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateBalance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ driverId, amount, reason }: { driverId: string; amount: number; reason?: string }) =>
      updateDriverBalance(driverId, amount, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast({
        title: "Balance Updated",
        description: `${data.full_name}'s balance is now ${data.bonus_amount} GHT`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast({
        title: "Driver Deleted",
        description: "The driver has been removed from the system",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export type { Driver };
