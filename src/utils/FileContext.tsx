import { createContext, useContext, useState } from "react"
import { LuLamp } from "react-icons/lu"

type BoxContextProps = {
  isOpen: boolean,
  setOpen : React.Dispatch<React.SetStateAction<boolean>>
}

export const BoxContext = createContext<BoxContextProps>({
  isOpen: false,
  setOpen: () => {}
})

export function BoxContextProvider({children}: {children: React.ReactNode}){
  const [isOpen,setOpen] = useState(false)
  return(
    <BoxContext.Provider value={{isOpen, setOpen}}>
    {children}
  </BoxContext.Provider>
  )
}

export function useBox() {
  const context = useContext(BoxContext);
  if (!context) {
    throw new Error("useBox must be used within a BoxContextProvider");
  }
  return context;
}
