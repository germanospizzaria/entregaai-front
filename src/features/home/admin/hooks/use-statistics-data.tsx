/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import type {
  DeliveryStatistics,
  StatisticsFilters,
} from "../types/statistics";
import { apiClient } from "../../../../shared/services/api.service";

export const useStatisticsData = () => {
  const [statistics, setStatistics] = useState<DeliveryStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StatisticsFilters>(() => ({
    startDate: undefined,
    period: "today",
  }));

  const buildQueryParams = useCallback((filters: Record<string, any>) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    return params.toString();
  }, []);

  const loadStatistics = useCallback(
    async (customFilters?: StatisticsFilters) => {
      setLoading(true);

      try {
        const currentFilters = customFilters || filters;
        const queryParams = buildQueryParams(currentFilters);
        const url = `/statistics/delivery${
          queryParams ? `?${queryParams}` : ""
        }`;

        const response = await apiClient.get<DeliveryStatistics>(url);
        setStatistics(response);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, buildQueryParams]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<StatisticsFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      loadStatistics(updatedFilters);
    },
    [filters, loadStatistics]
  );

  const setPeriod = useCallback(
    (period: "today" | "week" | "month" | "custom") => {
      let dateFilters = {};

      if (period === "today") {
        const today = new Date().toISOString().split("T")[0];
        dateFilters = { startDate: today, endDate: today };
      } else if (period === "week") {
        const today = new Date();
        const weekStart = new Date(
          today.setDate(today.getDate() - today.getDay())
        );
        const weekEnd = new Date(
          today.setDate(today.getDate() - today.getDay() + 6)
        );
        dateFilters = {
          startDate: weekStart.toISOString().split("T")[0],
          endDate: weekEnd.toISOString().split("T")[0],
        };
      } else if (period === "month") {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        dateFilters = {
          startDate: monthStart.toISOString().split("T")[0],
          endDate: monthEnd.toISOString().split("T")[0],
        };
      }

      updateFilters({ ...dateFilters, period });
    },
    [updateFilters]
  );

  useEffect(() => {
    loadStatistics();
  }, []);

  return {
    statistics,
    loading,
    filters,
    updateFilters,
    setPeriod,
    refetch: () => loadStatistics(),
  };
};
