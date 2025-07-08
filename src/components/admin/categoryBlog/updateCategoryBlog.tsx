import { Form, Input, Button } from 'antd';
import { PlusOutlined, CloseCircleOutlined, OrderedListOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUpdate } from '../../../hooks/useUpdate';
import { useOneData } from '../../../hooks/useOne';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EditCategoryBlog = () => {
    const nav = useNavigate();
    const { id } = useParams();
    console.log(id);
    
    const [form] = Form.useForm();

    const { data: categoryBlog } = useOneData({resource: `/categoryPost/admin`, _id:id});
    useEffect(() => {
        if (!categoryBlog || !categoryBlog.data) return;
        form.setFieldsValue(categoryBlog.data);
    }, [categoryBlog]);
    
    const { mutate } = useUpdate<FormData>({
        resource: `/categoryPost/admin`,
        _id:id
    })
    function onFinish (values:any) {
        mutate(values);
        nav('/admin/listCategoryBlog');
    }
    return (
        <AnimatePresence>
            <motion.div
                initial={{scaleY: 0.9,opacity: 0}}
                animate={{scaleY: 1 ,opacity: 1}}
                exit={{scaleY: 0.9,opacity: 0}}
                transition={{duration: 0.3}}
            >
                <div className="w-[90%] mx-auto mt-10 shadow-lg bg-white rounded-xl p-8 mb-10 border border-gray-100">
                    <div className='flex items-center justify-between m-1 pt-[0px]'>
                        <span>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">Update Category Blog</h3>
                        </span>
                        <span>
                            <Link to={`/admin/listCategoryBlog`}>
                                <Button className='text-[16px] font-sans' style={{height: 45, width: 190}} type='primary'><OrderedListOutlined /> LIST CATEGORY BLOG</Button>
                            </Link>
                        </span>
                    </div>
                    <hr className="border-t border-gray-200 mb-4" />

                    <Form 
                        layout="vertical" 
                        onFinish={onFinish} 
                        form={form}
                        onValuesChange={(changedValues, allValues) => {
                            if ("name" in changedValues) {
                                const rawName = changedValues.name || "";
                                const generatedSlug = rawName
                                .toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/[^a-z0-9 ]/g, "")
                                .trim()
                                .replace(/\s+/g, "-");
                                form.setFieldsValue({ slug: generatedSlug });
                            }
                        }}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true }]}
                            className="font-semibold"
                        >
                            <Input
                                className="h-[45px] rounded-md border-gray-300 hover:border-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Enter category name"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Slug"
                            name="slug"
                            rules={[{ required: true }]}
                            className="font-semibold"
                        >
                            <Input
                                className="h-[45px] rounded-md border-gray-300 hover:border-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Enter category slug"
                            />
                        </Form.Item>
                        <Form.Item>
                            <div className="flex gap-4 mt-4">
                                <Button
                                    style={{width: 170, height: 40}}
                                    type="primary"
                                    htmlType="submit"
                                    icon={<PlusOutlined />}
                                    className="h-10 w-[170px] text-base font-medium bg-blue-600 hover:bg-blue-700 transition-all"
                                >
                                Submit
                                </Button>
                                <Button
                                    style={{width: 170, height: 40}}
                                    htmlType="reset"
                                    danger
                                    icon={<CloseCircleOutlined />}
                                    className="h-10 w-[170px] text-base font-medium border-red-500 hover:bg-red-50"
                                >
                                Cancel
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditCategoryBlog;
