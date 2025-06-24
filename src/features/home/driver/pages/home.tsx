"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  CarOutlined,
  UserOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  CalendarFilled,
} from "@ant-design/icons";
import { Button, Drawer, Tag } from "antd";
import { ActiveDeliveries } from "../components/active-deliveries";
import { RunsDateFilter } from "../../admin/components/runs-date-filter";
import { useAuth } from "../../../auth/hooks/use-auth";
import { useDriverData } from "../hooks/use-driver-data";
import { StatusEntregador, type Driver } from "../types/driver";
import {
  isCurrentDayFilter,
  formatDateForDisplay,
} from "../../../../shared/utils/date";
import { apiClient } from "../../../../shared/services/api.service";
import { StatusCorrida } from "../types/run";
import { StatusParada } from "../types/stop";

export const DriverDashboard: React.FC = () => {
  const { userId, logout } = useAuth();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const {
    runs,
    loading,
    filters,
    updateFilters,
    clearFilters,
    resetToToday,
    refetch,
  } = useDriverData(userId ?? 0); // ID do entregador

  console.log(runs);
  useEffect(() => {
    const loadDriverData = async () => {
      try {
        const driverResponse = await apiClient.get<Driver>(
          `delivery-drivers/${userId}`
        );

        setDriver(driverResponse);
      } catch (error) {
        console.error("Erro ao carregar dados do entregador:", error);
      }
    };

    if (!loading) {
      loadDriverData();
    }
  }, [runs, loading, userId]);

  const handleCompleteStop = async (runId: number, stopId: number) => {
    if (!driver) return;

    try {
      const body = {
        deliveryDriverId: driver.id,
        stopId,
        runId,
      };

      await apiClient.post(`/run-execution/complete-stop`, body);
      refetch();
    } catch (error) {
      console.error("Erro ao completar parada:", error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const activeRuns =
    runs.filter((run) => run.status === StatusCorrida.EM_ANDAMENTO) || [];
  const completedStops =
    runs.reduce(
      (acc, run) =>
        acc +
        run.paradas.filter((stop) => stop.status === StatusParada.CONCLUIDA)
          .length,
      0
    ) || 0;
  const totalStops =
    runs.reduce((acc, run) => acc + run.paradas.length, 0) || 0;

  const isShowingToday = isCurrentDayFilter(filters.startDate, filters.endDate);
  const hasCustomFilters = filters.startDate || filters.endDate;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-italian-red rounded-full flex items-center justify-center">
              <CarOutlined className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-neutral-800">
                  Olá, {driver?.nome || "Entregador"}! 👋
                </h1>
                {isShowingToday && (
                  <Tag color="green" className="hidden sm:inline-flex">
                    <CalendarFilled className="mr-1" />
                    Hoje
                  </Tag>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-neutral-500 text-sm">
                  {isShowingToday
                    ? "Suas entregas de hoje"
                    : hasCustomFilters
                    ? `Período: ${formatDateForDisplay(
                        filters.startDate!
                      )} - ${formatDateForDisplay(filters.endDate!)}`
                    : "Suas entregas"}
                </p>
                {isShowingToday && (
                  <Tag color="green" className="sm:hidden">
                    Hoje
                  </Tag>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              icon={<CalendarOutlined />}
              onClick={() => setShowFiltersDrawer(true)}
              type={hasCustomFilters && !isShowingToday ? "primary" : "default"}
              className="hidden sm:flex"
            >
              {isShowingToday ? "Hoje" : "Filtros"}
            </Button>

            <Button
              icon={<CalendarOutlined />}
              onClick={() => setShowFiltersDrawer(true)}
              type={hasCustomFilters && !isShowingToday ? "primary" : "default"}
              size="small"
              className="sm:hidden"
            />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <LogoutOutlined />
              <span className="text-sm font-medium hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-italian-green/10 rounded-full flex items-center justify-center">
                <CarOutlined className="text-italian-green text-lg" />
              </div>
              <div>
                <p className="text-neutral-500 text-sm">Corridas Ativas</p>
                <p className="text-2xl font-semibold text-neutral-800">
                  {activeRuns.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleOutlined className="text-green-600 text-lg" />
              </div>
              <div>
                <p className="text-neutral-500 text-sm">Entregas Concluídas</p>
                <p className="text-2xl font-semibold text-neutral-800">
                  {completedStops}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-italian-cream rounded-full flex items-center justify-center">
                <UserOutlined className="text-italian-green text-lg" />
              </div>
              <div>
                <p className="text-neutral-500 text-sm">Status</p>
                <p className="text-lg font-semibold text-italian-green">
                  {driver?.status === StatusEntregador.ATIVO
                    ? "Ativo"
                    : "Inativo"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">
              Suas Entregas
            </h2>
            {totalStops > 0 && (
              <span className="bg-italian-green/10 text-italian-green text-sm font-medium px-3 py-1 rounded-full">
                {completedStops}/{totalStops} concluídas
              </span>
            )}
            {isShowingToday && (
              <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                <CalendarFilled className="mr-1" />
                Hoje
              </span>
            )}
            {hasCustomFilters && !isShowingToday && (
              <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                Filtrado
              </span>
            )}
          </div>

          <ActiveDeliveries
            runs={activeRuns}
            loading={loading}
            onCompleteStop={handleCompleteStop}
          />
        </div>
      </div>

      <Drawer
        title="Filtros de Data"
        placement="right"
        onClose={() => setShowFiltersDrawer(false)}
        open={showFiltersDrawer}
        width={400}
      >
        <RunsDateFilter
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
          onResetToToday={resetToToday}
          loading={loading}
          totalRuns={runs.length}
        />
      </Drawer>
    </div>
  );
};

export default DriverDashboard;
