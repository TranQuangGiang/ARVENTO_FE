import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { update, updateCoupon, type categoryBlogForm } from "../providers/data/dataProviders";
import { updateUser, useUpdateUserCLient, type updateRoleAdmin, type updateUserClient } from "../providers/auth/authProviders";



type useListParams = {
    resource: string ;
    _id?: string | number;
}
type userParams = {
    resource: string;
}
export const useUpdate = <T>({ resource, _id }: useListParams ) => {
    return useMutation({
        mutationFn: (values: T) => update({resource, _id, values }),
        onSuccess: () => {
            message.success("Cập nhập thành công ");
        },
        onError: (err:any) => {
            const errMessage = err?.response?.data?.message || "Đã có lỗi xảy ra";
            message.error(errMessage);
        }
    })
};

export const useUpdateCoupon = <T>({ resource, _id }: useListParams ) => {
    return useMutation({
        mutationFn: (values: T) => updateCoupon({resource, _id, values }),
        onSuccess: () => {
            message.success("Cập nhập thành công ");
        },
        onError: (err:any) => {
            const errMessage = err?.response?.data?.message || "Đã có lỗi xảy ra";
            message.error(errMessage);
        }
    })
};

export const useUpdateRole = ({ resource, _id }: useListParams) => {
    return useMutation({
        mutationFn: (values: updateRoleAdmin) => updateUser({resource, _id, values }),
        onSuccess: () => {
            message.success("Cập nhập thành công ");
        },
        onError: (err:any) => {
            const errMessage = err?.response?.data?.message || "Đã có lỗi xảy ra";
            message.error(errMessage);
        }
    })
}

export const useUpdateUser = ({ resource }: userParams) => {
    return useMutation({
        mutationFn: (values: updateUserClient) => useUpdateUserCLient({resource, values }),
        onSuccess: () => {
            message.success("Cập nhập thành công ");
        },
        onError: (err:any) => {
            const errMessage = err?.response?.data?.message || "Đã có lỗi xảy ra";
            message.error(errMessage);
        }
    })
}
