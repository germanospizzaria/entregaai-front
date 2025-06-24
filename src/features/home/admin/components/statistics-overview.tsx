import type React from "react";
import {
  TrophyOutlined,
  CarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { DeliveryStatistics } from "../types/statistics";

interface StatisticsOverviewProps {
  statistics: DeliveryStatistics;
  loading: boolean;
}

export const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({
  statistics,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-neutral-200 rounded w-20 mb-2" />
                <div className="h-8 bg-neutral-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total de Corridas",
      value: statistics.totalRuns,
      icon: <CarOutlined className="text-italian-green text-xl" />,
      bgColor: "bg-italian-green/10",
      changeType: "positive" as const,
    },
    {
      title: "Pedidos Entregues",
      value: statistics.totalDeliveries,
      icon: <CheckCircleOutlined className="text-green-600 text-xl" />,
      bgColor: "bg-green-100",
      changeType: "positive" as const,
    },
    {
      title: "Tempo Médio",
      value: `${statistics.averageDeliveryTime}min`,
      icon: <ClockCircleOutlined className="text-blue-600 text-xl" />,
      bgColor: "bg-blue-100",
      changeType: "positive" as const,
    },
    {
      title: "Taxa de Sucesso",
      value: `${statistics.efficiency.onTimeDeliveryRate}%`,
      icon: <TrophyOutlined className="text-orange-600 text-xl" />,
      bgColor: "bg-orange-100",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6 hover:shadow-medium transition-shadow"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 ${card.bgColor} rounded-full flex items-center justify-center`}
            >
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-neutral-500 text-sm mb-1">{card.title}</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl sm:text-3xl font-bold text-neutral-800">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
