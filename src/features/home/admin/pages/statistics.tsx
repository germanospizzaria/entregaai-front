import type React from "react";
import { useState } from "react";
import {
  ArrowLeftOutlined,
  BarChartOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { StatisticsOverview } from "../components/statistics-overview";
import { DriverPerformanceTable } from "../components/driver-performance-table";
import { HourlyChart } from "../components/hourly-chart";
import { StatusDistributionCard } from "../components/status-distribution-cards";
import { StatisticsPeriodSelector } from "../components/statistics-period-selector";
import { RunsDateFilter } from "../components/runs-date-filter";
import { useStatisticsData } from "../hooks/use-statistics-data";
import {
  isCurrentDayFilter,
  formatDateForDisplay,
} from "../../../../shared/utils/date";
import germanosLogo from "../../../../assets/germanos.jpeg";
import { Image } from "antd";

interface StatisticsPageProps {
  onBack: () => void;
}

export const StatisticsPage: React.FC<StatisticsPageProps> = ({ onBack }) => {
  const { statistics, loading, filters, updateFilters, setPeriod, refetch } =
    useStatisticsData();
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const isShowingToday = isCurrentDayFilter(filters.startDate, filters.endDate);
  const hasCustomFilters = filters.startDate || filters.endDate;

  if (loading && !statistics) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-neutral-200 rounded w-1/3" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-neutral-200 rounded" />
                ))}
              </div>
              <div className="h-64 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <ArrowLeftOutlined className="text-neutral-600" />
              </button>
              <Image
                width={30}
                src={germanosLogo || "/placeholder.svg"}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-italian-green to-italian-red rounded-full flex items-center justify-center"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-neutral-800">
                    Estatísticas de Entregas
                  </h1>
                  <div className="w-6 h-6 bg-italian-green/10 rounded-full flex items-center justify-center">
                    <BarChartOutlined className="text-italian-green text-sm" />
                  </div>
                </div>
                <p className="text-neutral-500 text-sm">
                  {isShowingToday
                    ? "Análise completa das entregas de hoje"
                    : hasCustomFilters
                    ? `Período: ${formatDateForDisplay(
                        filters.startDate!
                      )} - ${formatDateForDisplay(filters.endDate!)}`
                    : "Visão geral da performance da pizzaria"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                <StatisticsPeriodSelector
                  currentPeriod={filters.period || "today"}
                  onPeriodChange={setPeriod}
                  loading={loading}
                />
              </div>

              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFiltersDrawer(true)}
                type={
                  hasCustomFilters && !isShowingToday ? "primary" : "default"
                }
                className="lg:hidden"
              >
                Filtros
              </Button>

              <Button
                icon={<ReloadOutlined />}
                onClick={refetch}
                loading={loading}
                className="hidden sm:flex"
              >
                Atualizar
              </Button>
            </div>
          </div>

          <div className="mt-4 lg:hidden">
            <StatisticsPeriodSelector
              currentPeriod={filters.period || "today"}
              onPeriodChange={setPeriod}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {statistics && (
          <div className="space-y-6">
            <StatisticsOverview statistics={statistics} loading={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <HourlyChart
                  hourlyStats={statistics.hourlyStats}
                  loading={loading}
                />
              </div>

              <div>
                <StatusDistributionCard
                  statusDistribution={statistics.statusDistribution}
                  loading={loading}
                />
              </div>
            </div>

            <DriverPerformanceTable
              drivers={statistics.driverPerformance}
              loading={loading}
            />

            {statistics && (
              <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  Resumo {isShowingToday ? "de Hoje" : "do Período"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="p-4 bg-italian-green/5 rounded-lg">
                    <div className="text-2xl font-bold text-italian-green">
                      {statistics.totalRuns}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Corridas Realizadas
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {statistics.totalOrders}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Pedidos Processados
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {statistics.totalDeliveries}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Entregas Concluídas
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {statistics.averageDeliveryTime}min
                    </div>
                    <div className="text-sm text-neutral-600">Tempo Médio</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Drawer
        title="Filtros Avançados"
        placement="right"
        onClose={() => setShowFiltersDrawer(false)}
        open={showFiltersDrawer}
        width={400}
      >
        <div className="space-y-6">
          <RunsDateFilter
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={() => setPeriod("today")}
            loading={loading}
          />

          <div className="pt-4 border-t border-neutral-200">
            <h4 className="font-medium text-neutral-800 mb-3">
              Períodos Rápidos
            </h4>
            <StatisticsPeriodSelector
              currentPeriod={filters.period || "today"}
              onPeriodChange={setPeriod}
              loading={loading}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};
