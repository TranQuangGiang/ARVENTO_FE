import { useQuery } from "@tanstack/react-query"
import { getList } from "../providers/data/dataProviders"


type useListParams = {
    resource: string,
}

export const useList = ({resource}: useListParams) => {
    return useQuery({
        queryKey: [resource],
        queryFn: () => getList({resource})
        
    })
} 