export type Badge = "sponsor_confirmed" | "licensed_sponsor" | "sponsorship_mentioned";

export interface Job {
  id: string;
  external_id: string | null;
  title: string;
  company: string;
  location: string | null;
  salary: string | null;
  description: string | null;
  source: string | null;
  apply_url: string | null;
  sponsor_match: boolean;
  badge: Badge;
  category: string | null;
  positive_keywords: string[] | null;
  negative_keywords: string[] | null;
  posted_date: string | null;
  created_at: string | null;
  is_skilled_worker_sponsor: boolean | null;
  sponsor_routes: string | null;
  sponsor_rating: string | null;
  meets_general_threshold: string | null;
}

export interface Stats {
  total: number;
  sponsor_confirmed: number;
  licensed_sponsor: number;
  today: number;
}

export interface JobFilters {
  badge?: string;
  category?: string;
  location?: string;
  days?: number;
  search?: string;
  limit?: number;
  sourceType?: "main" | "test";
  salaryThreshold?: boolean;
}
