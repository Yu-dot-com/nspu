import { useQuery } from "@tanstack/react-query";
import supabase from "../database/supabase_client";
import { useUser } from "./useUser";

export const useAllUser = () => {
  const { data: currentUser } = useUser();

  return useQuery({
    queryKey: ["allUser", currentUser?.id],
    enabled: !!currentUser?.id, // wait until user is available
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        // .neq("id", currentUser.id); // exclude self

      if (error) alert("cant fetch all users")
      return data;
    },
  });
};
