import api from "./axios";
import type { Category } from "../types/category";

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/categories");
  return res.data;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const res = await api.get(`/categories/slug/${slug}`);
  return res.data;
};
