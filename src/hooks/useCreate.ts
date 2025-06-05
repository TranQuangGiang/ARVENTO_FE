import { useMutation } from "@tanstack/react-query";
import { create } from "../providers/data/dataProviders";
import { message } from "antd";

type useCreateParams = {
    resource: string;
};

export const useCreate = <T>({ resource }: useCreateParams) => {
    return useMutation({
        mutationFn: (values: T) => create<T>({ resource, values }),
        onSuccess: () => {
            message.success("Thêm mới thành công");
        },
        onError: (err: any) => {
            const errMessage = err?.response?.data?.message || "Đã có lỗi xảy ra";
            message.error(errMessage);
        }
    });
};