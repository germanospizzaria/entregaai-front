/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import type { Run } from "../../driver/types/run";
import type { RunFilters } from "../../admin/types/filters";
import { apiClient } from "../../../../shared/services/api.service";

export const useDriverData = (deliveryDriverId: number) => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<RunFilters>({
    startDate: undefined,
    endDate: undefined,
    status: undefined,
  });

  const buildQueryParams = useCallback((filters: Record<string, any>) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    return params.toString();
  }, []);

  const loadDriverRuns = useCallback(
    async (customFilters?: RunFilters) => {
      setLoading(true);

      try {
        const currentFilters = customFilters || filters;
        const queryParams = buildQueryParams(currentFilters);
        const url = `/run-dispatch/${deliveryDriverId}${
          queryParams ? `?${queryParams}` : ""
        }`;

        const response = await apiClient.get<Run[]>(url);
        console.log(response);
        setRuns(response);
      } catch (error) {
        console.error("Erro ao carregar corridas do entregador:", error);
      } finally {
        setLoading(false);
      }
    },
    [deliveryDriverId, filters, buildQueryParams]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<RunFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      loadDriverRuns(updatedFilters);
    },
    [filters, loadDriverRuns]
  );

  const setDateRange = useCallback(
    (startDate?: string, endDate?: string) => {
      updateFilters({ startDate, endDate });
    },
    [updateFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      startDate: undefined,
      endDate: undefined,
      status: undefined,
    });
    loadDriverRuns({
      startDate: undefined,
      endDate: undefined,
      status: undefined,
    });
  }, [loadDriverRuns]);

  const resetToToday = useCallback(() => {
    setDateRange();
  }, [setDateRange]);

  useEffect(() => {
    loadDriverRuns();
  }, []);

  return {
    runs,
    loading,
    filters,
    updateFilters,
    setDateRange,
    clearFilters,
    resetToToday,
    refetch: () => loadDriverRuns(),
  };
};
