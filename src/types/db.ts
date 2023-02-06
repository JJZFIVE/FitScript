type Customer = {
  phone: string;
  firstname: string;
  is_admin: boolean;
  date_registered: Date;
  premium: boolean;
  benchmark_page_secret_code: string;
  benchmark_page_prettier_id: string;
  recent_code_refresh: Date;
};

type Goal = {
  id: string;
  value: string;
  frequency_by_day: string | null;
  frequency_num_week: number | null;
  customer_phone: string;
};

type Benchmark = {
  id: string;
  type: string;
  value: string;
  units: string;
  customer_phone: string;
  timestamp: Date;
};

type Request = {
  id: string;
  request_text: string;
  timestamp: Date;
  customer_phone: string;
};

export type { Customer, Goal, Benchmark, Request };
