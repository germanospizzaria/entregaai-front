import type React from "react";
import {
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { StatusDistribution } from "../types/statistics";

interface StatusDistributionCardProps {
  statusDistribution: StatusDistribution;
  loading: boolean;
}

export const StatusDistributionCard: React.FC<StatusDistributionCardProps> = ({
  statusDistribution,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 animate-pulse">
        <div className="h-6 bg-neutral-200 rounded w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-neutral-200 rounded-full" />
              <div className="flex-1 h-4 bg-neutral-200 rounded" />
              <div className="w-12 h-4 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const total =
    statusDistribution.pending +
    statusDistribution.inRoute +
    statusDistribution.completed +
    (statusDistribution.cancelled || 0);

  const statusItems = [
    {
      label: "Aguardando",
      value: statusDistribution.pending,
      icon: <ClockCircleOutlined />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      barColor: "bg-orange-500",
    },
    {
      label: "Em Rota",
      value: statusDistribution.inRoute,
      icon: <CarOutlined />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      barColor: "bg-blue-500",
    },
    {
      label: "Concluídos",
      value: statusDistribution.completed,
      icon: <CheckCircleOutlined />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      barColor: "bg-green-500",
    },
    {
      label: "Cancelados",
      value: statusDistribution.cancelled || 0,
      icon: <CloseCircleOutlined />,
      color: "text-red-600",
      bgColor: "bg-red-100",
      barColor: "bg-red-500",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-italian-green/10 rounded-full flex items-center justify-center">
          <PieChartOutlined className="text-italian-green" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-800">
          Status dos Pedidos
        </h3>
      </div>

      <div className="space-y-4">
        {statusItems.map((item) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;

          return (
            <div key={item.label} className="flex items-center gap-4">
              <div
                className={`w-8 h-8 ${item.bgColor} rounded-full flex items-center justify-center`}
              >
                <span className={`${item.color} text-sm`}>{item.icon}</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-700">
                    {item.label}
                  </span>
                  <span className="text-sm text-neutral-500">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className={`${item.barColor} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="w-12 text-right">
                <div className={`text-lg font-bold ${item.color}`}>
                  {item.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600">Total de Pedidos</span>
          <span className="text-lg font-bold text-neutral-800">{total}</span>
        </div>
      </div>
    </div>
  );
};
