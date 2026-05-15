import api from "./axios";
import type { SubCategory } from "../types/subCategory";

export const getSubCategoriesByCategory = async (
  categoryId: number,
): Promise<SubCategory[]> => {
  const res = await api.get(`/categories/${categoryId}/subcategories`);
  return res.data;
};

export const getSubCategoryBySlug = async (
  slug: string,
): Promise<SubCategory> => {
  const res = await api.get(`/subcategories/slug/${slug}`);
  return res.data;
};
