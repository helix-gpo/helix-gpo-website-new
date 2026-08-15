export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  highlights: string[];
  startDate: string; // ISO-Datum vom Backend (LocalDate), z. B. "2025-11-01"
  tags: ProjectTag[];
}

export interface ProjectTag {
  value: string;
  colorHex: string;
}
