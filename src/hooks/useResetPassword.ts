import { useMutation } from "@tanstack/react-query"
import { resetPassword, type ResetPasswordForm } from "../providers/auth/authProviders"
import { message } from "antd"

type useListParams = {
    resource: string,
    onSuccess?: () => void;
}
export const useResetPassword = ({resource, onSuccess}: useListParams) => {
    return useMutation({
        mutationFn: (values: ResetPasswordForm) => resetPassword({resource, values}),
        onSuccess: () => {
            message.success("Password reset successful please login again");
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: (err:any) => {
            message.error(err.response?.data?.message || "Password reset failed");
        }
    })
}