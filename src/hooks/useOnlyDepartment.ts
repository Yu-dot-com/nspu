import { useQuery } from "@tanstack/react-query";
import supabase from "../database/supabase_client"

const fetchDepartment = async (ids: string[]) => {
    const validIds = ids.filter((id): id is string => !!id);

  if (validIds.length === 0) return []; 

  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .in("id", ids); 

  if (error) {
    console.log("Failed to fetch departments:", error.message);
  }
  return data || [];
};


export const useOnlyDepartment = (ids: string[] | undefined) => {
  return useQuery({
    queryKey: ["departments", ids],
    queryFn: () => fetchDepartment(ids ?? []),
    enabled: !!ids && ids.length > 0,
  });
};
