import { useQuery } from "@tanstack/react-query";
import supabase from "../database/supabase_client";

export type FileData = {
  id: string;
  name: string;
  path: string;
  size: number;
  duedate: string;
  status: boolean;
  important: boolean;
  filetype: string;
  visible: boolean;
  category_id: string;
  sender: string;
  receiver: string;
  department_ids: string;
  inboxoroutbox: "inbox" | "outbox";
  created_at: string
};

const fetchOnlyFile = async(id:string): Promise<FileData> =>{
    const {data,error} = await supabase.from("files").select("*").eq("id",id).single()
    if(error){
        console.log("failed to fetch file")
    }
    return data
}

export const useOnlyFile = (id:string|undefined) => {
    return useQuery<FileData>({
        queryKey: ["files",id],
        queryFn: () => fetchOnlyFile(id!),
        enabled: !!id
    })
}