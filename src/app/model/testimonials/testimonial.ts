export interface Testimonial {
  id: string;
  description: string;
  rating: number; // 1-5
  createdAt: string; // ISO-Instant vom Backend, z. B. "2025-12-05T14:00:00Z"
  partnerName: string;
  partnerRole: string;
  companyName: string;
}
