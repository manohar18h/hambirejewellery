export interface SubCategory {
  subCategoryId?: number;
  categoryId?: number;
  category?: {
    categoryId?: number;
    categoryName?: string;
  };
  subCategoryName: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  bannerImageUrl?: string;
  mobileBannerImageUrl?: string;
  iconImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  sortOrder?: number;
  activeStatus?: boolean;
  featured?: boolean;
}
