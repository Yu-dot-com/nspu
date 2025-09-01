import { useQuery } from "@tanstack/react-query";
import supabase from "../database/supabase_client"

const fetchCategory = async (id:string) => {
    const {data: categoryData,error: categoryError} = await supabase.from("categories").select("*").eq("id",id).single();
    if(categoryError){
        console.log("Failed to fetch category")
    }
    return categoryData
}

export const useOnlyCategory = (id: string) => {
    return useQuery({
        queryKey: ["categories",id],
        queryFn: () => fetchCategory(id!),
        enabled: !!id,
    })
}