import axios from "axios";

export type categoryBlogForm = {
    name: string;
    slug: string;
}

type useParams<T = any> = {
    resource: string,
    values: T,
}
type useListParams = {
    resource: string,
}
type useOneParams = {
    resource: string,
    _id?: string | number,
}
type useUpdateParams< T = any > = {
    resource: string,
    _id?: string | number,
    values: T,
}
axios.defaults.baseURL = "http://localhost:3000/api";
const token = localStorage.getItem("token") || "";
console.log(token);

const dataProvider = {
    getList: async({resource}: useListParams) => {
         if (!token) throw new Error('Token not found');
        const { data } = await axios.get(`${resource}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return data;
    },
    create: async <T>({resource, values}: useParams<T>) => {
        const isFormData = values instanceof FormData;
        const { data } = await axios.post(`${resource}`, values, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...(isFormData ? { "Content-Type": "multipart/form-data" } : {})
            }
        });
        return data;
    },
    deleteOne: async ({resource, _id}: useOneParams) => {
        const { data } = await axios.delete(`${resource}/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    },
    useOne: async ({resource, _id}: useOneParams) => {
        if (!_id) return;
        const { data } = await axios.get(`${resource}/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    },
    update: async <T>({resource, _id, values}: useUpdateParams<T>) => {
        const isFormData = values instanceof FormData;
        if (!_id) return;
        const { data } = await axios.put(`${resource}/${_id}`, values, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...(isFormData ? { "Content-Type": "multipart/form-data" } : {})
            }
        });
        return data;
    },
     updateCoupon: async <T>({resource, _id, values}: useUpdateParams<T>) => {
        const isFormData = values instanceof FormData;
        if (!_id) return;
        const { data } = await axios.patch(`${resource}/${_id}`, values, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...(isFormData ? { "Content-Type": "multipart/form-data" } : {})
            }
        });
        return data;
    }
}
export const { create, getList, deleteOne, update, useOne, updateCoupon } = dataProvider;  