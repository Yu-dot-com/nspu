import { useQuery } from "@tanstack/react-query"
import supabase from "../database/supabase_client"

const fetchAllFile = async(searchText="",searchDate="") => {

    let query = supabase.from("files").select("*")
    if(searchText){
        query = query.ilike("name",`%${searchText}%`)
    }

    if(searchDate){
        query = query.like("duedate",`${searchDate}%`)
    }

    const {error: fetchError, data: AllData} = await supabase.from("files").select("*");
    if(fetchError){
        alert("can't fetch all the files")
    }
    return AllData;
}

export const useFile = (searchText="",searchDate="") => {
    return useQuery({
        queryKey: ["files"],
        queryFn: ()=>fetchAllFile(searchText,searchDate),
    })
}