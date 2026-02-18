
import { supabase } from "../lib/supabase";
import { ScriptResult, ScriptHistoryItem, ScriptRequestData } from "../types";

export const addToHistory = async (request: ScriptRequestData, result: ScriptResult) => {
  const brandName = request.brand;

  const { error } = await supabase
    .from('script_history')
    .insert({
      brand: brandName,
      source_text: request.sourceText,
      result: result,
      is_used: false
    });

  if (error) {
    console.error('Error saving to history:', error);
    // We don't throw here to avoid disrupting the UI flow if the DB is down, just log it.
  }
};

export const getHistory = async (): Promise<ScriptHistoryItem[]> => {
  const { data, error } = await supabase
    .from('script_history')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as ScriptHistoryItem[];
};

export const toggleUsedStatus = async (id: number, currentStatus: boolean) => {
  const { error } = await supabase
    .from('script_history')
    .update({ is_used: !currentStatus })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};
