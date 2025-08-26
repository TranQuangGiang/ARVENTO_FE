import { useQuery } from "@tanstack/react-query"
import { getList, getListClient } from "../providers/data/dataProviders"


type useListParams = {
    resource: string,
    params?: object,
    config?: object,
    options?: object,
    responseType?: string,
    token?: string | null;
}

export const useList = ({resource, token}: useListParams) => {
    return useQuery({
        queryKey: [resource, token],
        queryFn: () => getList({resource})
    })
};

export const useListClient = ({resource}: useListParams) => {
    return useQuery({
        queryKey: [resource],
        queryFn: () => getListClient({resource})
    })

};