import { useQuery } from "@tanstack/react-query";
import { useOne } from "../providers/data/dataProviders";

type useListParams = {
    resource: string ;
    _id?: string | number;
}

export const useOneData = ({ resource, _id } : useListParams) => {
    return useQuery({
        queryKey: [resource, _id],
        queryFn: () => useOne({ resource, _id }),
        enabled: !!_id,
    });
};

