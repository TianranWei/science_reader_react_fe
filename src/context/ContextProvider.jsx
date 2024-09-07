import React, {createContext, useContext, useEffect,useState} from "react"
const StateContext= createContext()
export const ContextProvider=({children})=>{
    const [fileUrl, setFileUrl] = useState('');
    const [file, setFile]=useState("")
    const [chatHistory, setChatHistory]=useState([])
    const [comperhensionHistory, setComperhensionHistory]=useState([])
    const [response, setResponse] = useState();
    const [summary , setSummary]=useState(false)
    const [summaryFetched, setSummaryFetched] = useState(false);
    
    return( <StateContext.Provider 
        value={{
            file,
            setFile,
            fileUrl,
            setFileUrl,
            chatHistory,
            setChatHistory,
            summary,
            setSummary,
            summaryFetched,
            setSummaryFetched,
            comperhensionHistory,
            setComperhensionHistory, 
            response,
            setResponse
        }}>
        {children}
        </StateContext.Provider>
    )
}

export const useStateContext=()=>useContext(StateContext)
