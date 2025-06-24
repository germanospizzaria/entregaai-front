/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Order } from "../types/order";
import type { Run } from "../../driver/types/run";
import type { Driver } from "../../driver/types/driver";
import type { RunFilters, OrderFilters } from "../types/filters";
import { apiClient } from "../../../../shared/services/api.service";

export const useDeliveryData = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [availableDeliveryPersons, setAvailableDeliveryPersons] = useState<
    Driver[]
  >([]);
  const [activeRuns, setActiveRuns] = useState<Run[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [runFilters, setRunFilters] = useState<RunFilters>({
    startDate: undefined,
    endDate: undefined,
    status: undefined,
  });
  const [orderFilters, setOrderFilters] = useState<OrderFilters>({
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

  const loadData = useCallback(
    async (
      customRunFilters?: RunFilters,
      customOrderFilters?: OrderFilters
    ) => {
      setLoading(true);

      try {
        const currentRunFilters = customRunFilters || runFilters;
        const currentOrderFilters = customOrderFilters || orderFilters;

        const runQueryParams = buildQueryParams(currentRunFilters);
        const runUrl = `/run-dispatch${
          runQueryParams ? `?${runQueryParams}` : ""
        }`;

        const orderQueryParams = buildQueryParams(currentOrderFilters);
        const orderUrl = `/orders${
          orderQueryParams ? `?${orderQueryParams}` : ""
        }`;

        const [
          pendingOrdersResponse,
          deliveryDriversResponse,
          activeRunsResponse,
          ordersResponse,
        ] = await Promise.all([
          apiClient.get<Order[]>(orderUrl),
          apiClient.get<Driver[]>("/delivery-drivers"),
          apiClient.get<Run[]>(runUrl),
          apiClient.get<Order[]>(orderUrl),
        ]);

        setPendingOrders(pendingOrdersResponse);
        setAvailableDeliveryPersons(deliveryDriversResponse);
        setActiveRuns(activeRunsResponse);
        setOrders(ordersResponse);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    },
    [runFilters, orderFilters, buildQueryParams]
  );

  const updateRunFilters = useCallback(
    (newFilters: Partial<RunFilters>) => {
      const updatedFilters = { ...runFilters, ...newFilters };
      setRunFilters(updatedFilters);
      loadData(updatedFilters, orderFilters);
    },
    [runFilters, orderFilters, loadData]
  );

  const updateOrderFilters = useCallback(
    (newFilters: Partial<OrderFilters>) => {
      const updatedFilters = { ...orderFilters, ...newFilters };
      setOrderFilters(updatedFilters);
      loadData(runFilters, updatedFilters);
    },
    [runFilters, orderFilters, loadData]
  );

  const clearFilters = useCallback(() => {
    setRunFilters({
      startDate: undefined,
      endDate: undefined,
      status: undefined,
    });
    setOrderFilters({
      startDate: undefined,
      endDate: undefined,
      status: undefined,
    });
    loadData({
      startDate: undefined,
      endDate: undefined,
      status: undefined,
    });
  }, [loadData]);

  const setDateRange = useCallback(
    (startDate?: string, endDate?: string) => {
      const dateFilters = { startDate, endDate };
      updateRunFilters(dateFilters);
      updateOrderFilters(dateFilters);
    },
    [updateRunFilters, updateOrderFilters]
  );

  const resetToToday = useCallback(() => {
    setDateRange(undefined, undefined);
  }, [setDateRange]);

  useEffect(() => {
    loadData();
  }, []);

  return {
    // Dados
    pendingOrders,
    availableDeliveryPersons,
    activeRuns,
    orders,
    loading,

    // Estados dos filtros
    runFilters,
    orderFilters,

    // Funções de controle
    setPendingOrders,
    setActiveRuns,
    refetch: () => loadData(),

    // Funções de filtro
    updateRunFilters,
    updateOrderFilters,
    clearFilters,
    setDateRange,
    resetToToday,
  };
};
