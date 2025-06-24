/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import type {
  Driver,
  CreateDeliveryDriverDto,
} from "../../driver/types/driver";
import { apiClient } from "../../../../shared/services/api.service";

export const useDeliveryDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<Driver[]>("/delivery-drivers");
      setDrivers(response);
    } catch (error) {
      console.error("Erro ao carregar entregadores:", error);
      message.error("Erro ao carregar entregadores");
    } finally {
      setLoading(false);
    }
  }, []);

  const createDriver = useCallback(
    async (data: CreateDeliveryDriverDto): Promise<boolean> => {
      setCreating(true);
      try {
        const response = await apiClient.post<Driver>(
          "/delivery-drivers",
          data
        );
        setDrivers((prev) => [...prev, response]);
        message.success("Entregador criado com sucesso!");
        return true;
      } catch (error: any) {
        console.error("Erro ao criar entregador:", error);
        const errorMessage =
          error?.response?.data?.message || "Erro ao criar entregador";
        message.error(errorMessage);
        return false;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  return {
    drivers,
    loading,
    creating,
    createDriver,
    refetch: loadDrivers,
  };
};
