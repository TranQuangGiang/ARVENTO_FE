import { useMutation } from "@tanstack/react-query";
import { forgotPassword, type ForgotPasswordForm } from "../providers/auth/authProviders";
import { message } from "antd";

type useListParams = {
    resource: string;
    onSuccess?: () => void;
    onError?: () => void;
}

export const useForgotPassword = ({resource, onSuccess, onError}: useListParams) => {
    return useMutation({
        mutationFn: (values: ForgotPasswordForm) => forgotPassword({resource, values}),
        onSuccess: () => {
            message.success("Password reset email has been sent");
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: (err:any) => {
            message.error(err.response?.data?.message || "Error sending request");
            if (onError) {
                onError();
            }
        },
    })
}