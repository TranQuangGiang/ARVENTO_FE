import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { update, type categoryBlogForm } from "../providers/data/dataProviders";



type useListParams = {
    resource: string ;
    _id?: string | number;
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
}