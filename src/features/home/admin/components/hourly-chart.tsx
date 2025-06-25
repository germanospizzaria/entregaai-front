import type React from "react";
import { ClockCircleOutlined, BarChartOutlined } from "@ant-design/icons";
import type { HourlyStatistics } from "../types/statistics";

interface HourlyChartProps {
  hourlyStats: HourlyStatistics[];
  loading: boolean;
}

export const HourlyChart: React.FC<HourlyChartProps> = ({
  hourlyStats,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 animate-pulse">
        <div className="h-6 bg-neutral-200 rounded w-48 mb-6" />
        <div className="h-64 bg-neutral-100 rounded" />
      </div>
    );
  }

  const maxOrders = Math.max(...hourlyStats.map((stat) => stat.totalOrders));

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <BarChartOutlined className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-800">
          Pedidos por Horário
        </h3>
      </div>

      <div className="space-y-4">
        {hourlyStats.map((stat) => (
          <div key={stat.hour} className="flex items-center gap-4">
            <div className="w-16 text-sm font-medium text-neutral-600 flex items-center gap-1">
              <ClockCircleOutlined className="text-xs" />
              {stat.hour}:00
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-600">
                  {stat.totalOrders} pedidos • {stat.completedDeliveries}{" "}
                  entregues
                </span>
                <span className="text-xs text-neutral-500">
                  {stat.averageDeliveryTime}min médio
                </span>
              </div>

              <div className="relative">
                <div className="w-full bg-neutral-200 rounded-full h-3">
                  <div
                    className="bg-neutral-200 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${(stat.totalOrders / maxOrders) * 100}%`,
                    }}
                  />
                </div>
                <div
                  className="absolute top-0 bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (stat.completedDeliveries / stat.totalOrders) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="w-12 text-right">
              <div className="text-sm font-semibold text-neutral-800">
                {stat.totalOrders}
              </div>
              <div className="text-xs text-green-600">
                {stat.completedDeliveries}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-italian-green rounded-full" />
              <span className="text-neutral-600">Total de Pedidos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
              <span className="text-neutral-600">Entregues</span>
            </div>
          </div>
          <div className="text-neutral-500">
            Pico: {hourlyStats.find((s) => s.totalOrders === maxOrders)?.hour}
            :00h
          </div>
        </div>
      </div>
    </div>
  );
};
