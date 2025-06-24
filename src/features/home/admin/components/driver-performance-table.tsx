import type React from "react";
import {
  UserOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CarOutlined,
} from "@ant-design/icons";
import type { DriverPerformance } from "../types/statistics";

interface DriverPerformanceTableProps {
  drivers: DriverPerformance[];
  loading: boolean;
}

export const DriverPerformanceTable: React.FC<DriverPerformanceTableProps> = ({
  drivers,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
        <div className="h-6 bg-neutral-200 rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg animate-pulse"
            >
              <div className="w-12 h-12 bg-neutral-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-32" />
                <div className="h-3 bg-neutral-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600 bg-green-100";
    if (efficiency >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getEfficiencyIcon = (efficiency: number) => {
    if (efficiency >= 90) return <TrophyOutlined />;
    if (efficiency >= 75) return <CheckCircleOutlined />;
    return <WarningOutlined />;
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-italian-red/10 rounded-full flex items-center justify-center">
          <UserOutlined className="text-italian-red" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-800">
          Performance dos Entregadores
        </h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {drivers.map((driver) => (
          <div
            key={driver.driverId}
            className="p-4 sm:p-5 bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-italian-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                <UserOutlined className="text-italian-green" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-neutral-800 text-base">
                      {driver.driverName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          driver.status === "ATIVO"
                            ? "bg-green-100 text-green-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {driver.status}
                      </span>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getEfficiencyColor(
                          driver.efficiency
                        )}`}
                      >
                        {getEfficiencyIcon(driver.efficiency)}
                        <span>{driver.efficiency}% eficiência</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CarOutlined className="text-neutral-400" />
                    <div>
                      <div className="text-neutral-500 text-xs">Corridas</div>
                      <div className="font-semibold text-neutral-800">
                        {driver.totalRuns}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500" />
                    <div>
                      <div className="text-neutral-500 text-xs">Entregas</div>
                      <div className="font-semibold text-neutral-800">
                        {driver.completedDeliveries}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-blue-500" />
                    <div>
                      <div className="text-neutral-500 text-xs">
                        Tempo Médio
                      </div>
                      <div className="font-semibold text-neutral-800">
                        {driver.averageDeliveryTime}min
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrophyOutlined className="text-orange-500" />
                    <div>
                      <div className="text-neutral-500 text-xs">No Prazo</div>
                      <div className="font-semibold text-neutral-800">
                        {driver.onTimeDeliveries}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra de progresso da eficiência */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                    <span>Eficiência Geral</span>
                    <span className="font-semibold">{driver.efficiency}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        driver.efficiency >= 90
                          ? "bg-green-500"
                          : driver.efficiency >= 75
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${driver.efficiency}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
