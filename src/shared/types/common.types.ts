export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type Nullable<T> = T | null | undefined;

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ViewportMode = 'mobile' | 'tablet' | 'desktop';
