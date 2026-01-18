interface ServerResponse<T> {
  data: T;
  message: string;
}

interface DecodedToken {
  userId: string;
}

interface PaginatedResponse<T> {
  records: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

interface ServerErrorResponse {
  name: string;
  httpCode: number;
  isOperational: boolean;
  description: string;
}

export type {
  ServerResponse,
  DecodedToken,
  PaginatedResponse,
  ServerErrorResponse,
};
