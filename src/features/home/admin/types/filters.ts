export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface RunFilters extends DateRangeFilter {
  status?: string;
  deliveryDriverId?: number;
}

export interface OrderFilters extends DateRangeFilter {
  status?: string;
  search?: string;
}
