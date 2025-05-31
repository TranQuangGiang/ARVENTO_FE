import { useMutation } from "@tanstack/react-query";
import { login, type loginForm } from "../providers/auth/dataProviders";


type useListParams = {
    resource: string;
}

export const useLogin = ({resource}: useListParams) => {
    return useMutation({
        mutationFn: (values: loginForm) => login({resource, values})
    })
}