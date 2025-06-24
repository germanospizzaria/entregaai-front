import type React from "react";
import { Card, Space, Typography, Tag } from "antd";
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import { DateRangeFilter } from "./date-ranger-filter";
import type { RunFilters } from "../types/filters";

const { Text } = Typography;

interface RunsDateFilterProps {
  filters: RunFilters;
  onFiltersChange: (filters: Partial<RunFilters>) => void;
  onClearFilters: () => void;
  onResetToToday?: () => void;
  loading?: boolean;
  totalRuns?: number;
  className?: string;
}

export const RunsDateFilter: React.FC<RunsDateFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading = false,
  totalRuns,
  className = "",
}) => {
  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    onFiltersChange({ startDate, endDate });
  };

  const hasActiveFilters = filters.startDate || filters.endDate;

  return (
    <Card
      className={`shadow-soft border border-neutral-200 ${className}`}
      bodyStyle={{ padding: "16px" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-neutral-600" />
          <Text strong className="text-neutral-800">
            Filtrar Corridas
          </Text>
          {totalRuns !== undefined && (
            <Tag color={hasActiveFilters ? "blue" : "default"}>
              {totalRuns} {totalRuns === 1 ? "corrida" : "corridas"}
            </Tag>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            disabled={loading}
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <Space direction="vertical" className="w-full" size="middle">
        <div>
          <Text className="text-sm font-medium text-neutral-700 block mb-2">
            <CalendarOutlined className="mr-1" />
            Período das Corridas
          </Text>
          <DateRangeFilter
            startDate={filters.startDate}
            endDate={filters.endDate}
            onDateRangeChange={handleDateRangeChange}
            loading={loading}
            placeholder={["Data inicial", "Data final"]}
            className="w-full"
          />
        </div>

        {hasActiveFilters && (
          <div className="pt-2 border-t border-neutral-200">
            <Text className="text-xs text-neutral-500">
              Filtros ativos:
              {filters.startDate && filters.endDate && (
                <Tag className="ml-1">
                  {new Date(filters.startDate).toLocaleDateString("pt-BR")} -{" "}
                  {new Date(filters.endDate).toLocaleDateString("pt-BR")}
                </Tag>
              )}
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};
