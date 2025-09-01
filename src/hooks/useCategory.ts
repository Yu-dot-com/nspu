import { useQuery } from "@tanstack/react-query"
import supabase from "../database/supabase_client"

const fetchCategory = async() => {
    const {data,error} = await supabase.from("categories").select("*");
    if(error){
        alert("categories error")
    }
    return data
    
}

export const useCategory = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategory
    })
}