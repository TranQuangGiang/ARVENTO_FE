import { useQuery } from "@tanstack/react-query"
import { getList, getListClient } from "../providers/data/dataProviders"


type useListParams = {
    resource: string,
    params?: object,
    config?: object,
    options?: object,
    responseType?: string,
}

export const useList = ({resource}: useListParams) => {
    return useQuery({
        queryKey: [resource],
        queryFn: () => getList({resource})
    })
};

export const useListClient = ({resource}: useListParams) => {
    return useQuery({
        queryKey: [resource],
        queryFn: () => getListClient({resource})
    })

};