
import { supabase } from "../lib/supabase";
import { Brand, BrandKnowledge } from "../types";

export const getBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');
  
  if (error) throw new Error(error.message);
  return data as Brand[];
};

export const addBrand = async (name: string): Promise<Brand> => {
  const { data, error } = await supabase
    .from('brands')
    .insert([{ name }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Brand;
};

export const getBrandKnowledge = async (brandId: number): Promise<BrandKnowledge[]> => {
  const { data, error } = await supabase
    .from('brand_knowledge')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as BrandKnowledge[];
};

export const addBrandKnowledge = async (brandId: number, content: string): Promise<BrandKnowledge> => {
  const { data, error } = await supabase
    .from('brand_knowledge')
    .insert([{ brand_id: brandId, content }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as BrandKnowledge;
};

export const deleteBrandKnowledge = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('brand_knowledge')
    .delete()
    .eq('id', id);
  
  if (error) throw new Error(error.message);
};
