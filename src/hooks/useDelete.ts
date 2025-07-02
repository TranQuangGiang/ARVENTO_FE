import { useMutation } from "@tanstack/react-query";
import { deleteOne } from "../providers/data/dataProviders";
import { message } from "antd";


type useListParams = {
    resource: string,
    onSuccess?: () => void;
}
export const useDelete = ({resource, onSuccess}: useListParams) => {
    return useMutation({
        mutationFn: ( _id:string ) => deleteOne({resource, _id}),
        onSuccess: () => {
            message.success("Delete successful");
            if (onSuccess) {
                onSuccess();
            } 
        },
        onError: (err:any) => {
            const errMessage = err?.response?.data?.message || "Đã có lỗi xảy ra";
            message.error(errMessage);
        }
    })
}