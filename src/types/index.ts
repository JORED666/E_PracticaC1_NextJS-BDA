// Tipos para las tablas
export interface Member {
  id: number;
  name: string;
  email: string;
  member_type: string;
  joined_at: Date;
  is_active: boolean;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publication_year: number;
}

// Tipos para las VIEWS
export interface MostBorrowedBook {
  book_id: number;
  title: string;
  author: string;
  category: string;
  total_loans: number;
  popularity_rank: number;
  currently_loaned: number;
  completed_loans: number;
}

export interface OverdueLoan {
  loan_id: number;
  member_id: number;
  member_name: string;
  member_email: string;
  book_title: string;
  book_author: string;
  barcode: string;
  loaned_at: Date;
  due_at: Date;
  days_overdue: number;
  suggested_fine_amount: number;
}

export interface FinesSummary {
  month: Date;
  month_label: string;
  total_fines: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  paid_count: number;
  pending_count: number;
  payment_rate_percentage: number;
}

export interface MemberActivity {
  member_id: number;
  name: string;
  email: string;
  member_type: string;
  joined_at: Date;
  is_active: boolean;
  total_loans: number;
  completed_loans: number;
  overdue_loans: number;
  active_loans: number;
  total_fines: number;
  pending_fines: number;
  last_loan_date: Date;
  overdue_rate_percentage: number;
  status_category: string;
}

export interface InventoryHealth {
  category: string;
  unique_books: number;
  total_copies: number;
  available_copies: number;
  loaned_copies: number;
  damaged_copies: number;
  lost_copies: number;
  availability_percentage: number;
  health_status: string;
}
