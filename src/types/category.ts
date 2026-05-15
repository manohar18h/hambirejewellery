export interface Category {
  categoryId?: number;
  metal: string;
  categoryName: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  bannerImageUrl?: string;
  mobileBannerImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  sortOrder?: number;
  activeStatus?: boolean;
  featured?: boolean;
}
