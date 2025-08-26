import { useQuery } from "@tanstack/react-query";
import { useOne } from "../providers/data/dataProviders";
import { useUser } from "../providers/auth/authProviders";

type useListParams = {
    resource: string ;
    _id?: string | number;
    enabled?: any;
}
type useListUserMe = {
    resource: string ;
    token: string | null;
}

export const useOneData = ({ resource, _id } : useListParams) => {
    return useQuery({
        queryKey: [resource, _id],
        queryFn: () => useOne({ resource, _id }),
        enabled: !!_id,
    });
};

export const useUserMe = ({ resource, token }:useListUserMe ) => {
    return useQuery({
        queryKey: [resource, token],
        queryFn: () => useUser({ resource }),
    });
}

