import { createContext, useContext, useState } from "react"

interface fileSearch {
    name: string,
    date: string
}

type SearchContextProps = {
    search: fileSearch
    setsearch: (search: fileSearch)=>void
}

const FileSearchContext = createContext<SearchContextProps | undefined>(undefined)

export const FileSearchProvider = ({children}: {children : React.ReactNode}) => {

    const [search,setsearch] = useState<fileSearch>({name: "",date: ""})

    return (
        <FileSearchContext.Provider value={{search,setsearch}}>
            {children}
        </FileSearchContext.Provider>
    )
}

export function useSearch (){
    const context = useContext(FileSearchContext)
    if(!context){
        throw new Error("useFileSearch must be used inside FileSearchProvider")
    }
    return context
}