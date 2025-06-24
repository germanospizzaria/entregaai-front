import type React from "react";
import { useState, useEffect } from "react";
import { DatePicker, Button } from "antd";
import {
  CalendarOutlined,
  ClearOutlined,
  CalendarFilled,
} from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  isCurrentDayFilter,
  getCurrentDateISO,
} from "../../../../shared/utils/date";

const { RangePicker } = DatePicker;

interface DateRangeFilterProps {
  startDate?: string;
  endDate?: string;
  onDateRangeChange: (startDate?: string, endDate?: string) => void;
  onClear?: () => void;
  loading?: boolean;
  placeholder?: [string, string];
  size?: "small" | "middle" | "large";
  className?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
  onClear,
  loading = false,
  placeholder = ["Data inicial", "Data final"],
  size = "middle",
  className = "",
}) => {
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(() => {
    if (startDate && endDate) {
      return [dayjs(startDate), dayjs(endDate)];
    }
    return null;
  });

  // Atualizar estado interno quando props mudarem
  useEffect(() => {
    if (startDate && endDate) {
      setDateRange([dayjs(startDate), dayjs(endDate)]);
    } else {
      setDateRange(null);
    }
  }, [startDate, endDate]);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);

    if (dates && dates[0] && dates[1]) {
      // Converter para formato ISO string (YYYY-MM-DD)
      const start = dates[0].format("YYYY-MM-DD");
      const end = dates[1].format("YYYY-MM-DD");
      onDateRangeChange(start, end);
    } else {
      onDateRangeChange(undefined, undefined);
    }
  };

  const handleClear = () => {
    setDateRange(null);
    onDateRangeChange(undefined, undefined);
    onClear?.();
  };

  const handleTodayClick = () => {
    const today = getCurrentDateISO();
    const todayDayjs = dayjs(today);
    setDateRange([todayDayjs, todayDayjs]);
    onDateRangeChange(today, today);
  };

  const hasDateRange = dateRange && dateRange[0] && dateRange[1];
  const isToday =
    startDate && endDate && isCurrentDayFilter(startDate, endDate);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <RangePicker
        value={dateRange}
        onChange={handleDateChange}
        placeholder={placeholder}
        format="DD/MM/YYYY"
        size={size}
        disabled={loading}
        allowClear={false}
        suffixIcon={<CalendarOutlined className="text-neutral-400" />}
        className="flex-1"
        style={{ minWidth: 200 }}
      />

      <div className="flex items-center gap-1">
        {/* Botão Hoje */}
        {!isToday && (
          <Button
            type="text"
            icon={<CalendarFilled />}
            onClick={handleTodayClick}
            disabled={loading}
            size={size}
            className="text-italian-green hover:text-italian-green/80 hover:bg-italian-green/10"
            title="Filtrar por hoje"
          />
        )}

        {/* Botão Limpar */}
        {hasDateRange && (
          <Button
            type="text"
            icon={<ClearOutlined />}
            onClick={handleClear}
            disabled={loading}
            size={size}
            className="text-neutral-500 hover:text-neutral-700"
            title="Limpar filtro de data"
          />
        )}
      </div>
    </div>
  );
};
