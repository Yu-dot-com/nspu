import { useQuery } from "@tanstack/react-query"
import supabase from "../database/supabase_client"

const fetchDepartment = async() => {
    const {data,error} = await supabase.from("departments").select("*");
    if(error){
        throw new Error(error.message)
    }
    return data
    
}

export const useDepartment = () => {
    return useQuery({
        queryKey: ["departments"],
        queryFn: fetchDepartment
    })
}