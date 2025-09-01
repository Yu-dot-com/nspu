import { useQuery } from "@tanstack/react-query";
import supabase from "../database/supabase_client";
import { useUser } from "./useUser";

export const useNotiHistory = () => {
  const { data: UserData } = useUser();
  return useQuery({
    queryKey: ["notification_history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_history")
        .select(`id,user_id,title,file_id,body,sent_at,files(name)`)
        .eq("user_id", UserData.id);

      console.log(data);
      if (error) alert("cant fetch all users");
      return data;
    },
    // gcTime: 1000 * 60 * 10, 
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
    // refetchOnReconnect: false, 
  });
};
