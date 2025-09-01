import { useQuery } from "@tanstack/react-query";
import supabase from "../database/supabase_client";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university?: string;
  department_id?: string;
  role: "user" | "admin";
  avatar_url: string;
};

const fetchUser = async () => {
  const { data: UserData, error: Usererror } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", UserData.user.id)
    .single<UserProfile>();
  if (Usererror) throw new Error(Usererror.message);
  if (error) throw new Error(error.message);

  return data;
};

export const useUser = () => {
  return useQuery({
    queryKey: ["Users"],
    queryFn: fetchUser,
  });
};
