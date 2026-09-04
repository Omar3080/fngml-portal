export interface Video {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  category: string;
  tags?: string[];
  views: number;
  createdAt: string;
  description?: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  adminPin: string;
  adBannerCode?: string;
}
