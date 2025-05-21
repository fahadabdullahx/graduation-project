import { createClient } from "@/lib/supabase/client";

export async function GetImageUrl(path) {
  if (!path || path === "" || path === null || path === undefined) {
    return null;
  }
  const supabase = createClient();
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) {
      throw error;
    }
    const url = URL.createObjectURL(data);

    return url;
  } catch (error) {
    console.error("GetImageUrl- Error downloading image:", error);
    return { error: error };
  }
}
