import type React from "react";
import { Button } from "antd";
import {
  CalendarFilled,
  CalendarOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

interface StatisticsPeriodSelectorProps {
  currentPeriod: "today" | "week" | "month" | "custom";
  onPeriodChange: (period: "today" | "week" | "month" | "custom") => void;
  loading?: boolean;
}

export const StatisticsPeriodSelector: React.FC<
  StatisticsPeriodSelectorProps
> = ({ currentPeriod, onPeriodChange, loading = false }) => {
  const periods = [
    {
      key: "today" as const,
      label: "Hoje",
      icon: <CalendarFilled />,
    },
    {
      key: "week" as const,
      label: "Esta Semana",
      icon: <CalendarOutlined />,
    },
    {
      key: "month" as const,
      label: "Este Mês",
      icon: <HistoryOutlined />,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {periods.map((period) => (
        <Button
          key={period.key}
          type={currentPeriod === period.key ? "primary" : "default"}
          icon={period.icon}
          onClick={() => onPeriodChange(period.key)}
          disabled={loading}
          className={`${
            currentPeriod === period.key
              ? "bg-italian-green border-italian-green hover:bg-italian-green/90"
              : "hover:border-italian-green hover:text-italian-green"
          }`}
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};
