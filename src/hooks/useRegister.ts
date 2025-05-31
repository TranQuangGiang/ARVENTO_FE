import { useMutation } from "@tanstack/react-query"
import { register, type registerForm } from "../providers/auth/dataProviders"

type useListParams = {
    resource: string
}

export const useRegister = ({resource}: useListParams) => {
    return useMutation({
        mutationFn: (values: registerForm) => register({resource, values}) 
    })
}    