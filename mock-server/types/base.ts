type Metadata = {
  aggregates: null;
};

type Pagination = {
  limit: number;
  offset: number;
  total: number;
};

export type TodayTixAPIRes<T> = {
  code: number;
  data: T;
  metadata?: Metadata;
  pagination?: Pagination;
};

type TodayTixAPIErrorContext = {
  parameterName: string | null;
  internalMessage: string;
};

export type TodayTixAPIError = {
  code?: number;
  error: string;
  context?: TodayTixAPIErrorContext;
  title?: string;
  message?: string;
};
