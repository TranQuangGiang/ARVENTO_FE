import { Button, Form, Input, Radio, Select, Upload } from 'antd';
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { OrderedListOutlined, UploadOutlined } from '@ant-design/icons';
import { useList } from '../../../hooks/useList';
import { useCreate } from '../../../hooks/useCreate';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AddBlog:React.FC = () => {
    const [form] = Form.useForm();
    const nav = useNavigate();
    const [content,setContent] = useState('');
    const [thumbnail, setThumbnail] = useState<any>(null);
    {/* Lấy ra danh mục bài viết */}
    const { data } = useList(
        { resource: "/categoryPost/admin"}
    )
    const categoryOptions = data?.data.map((cat:any) => ({
        label: cat.name,
        value: cat._id
    }))
    
    {/* xử lý thêm mới bài viết */}
    const { mutate } = useCreate<FormData>({
        resource: "/posts/admin"
    })
    const onFinish = (values:any) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('slug', values.slug);
        formData.append('category', values.category);
        formData.append('status', values.status);
        formData.append('excerpt', values.excerpt);
        formData.append('content', content);
        formData.append('thumbnail', thumbnail);
        values.tags.forEach((tag: string) => {
            formData.append('tags', tag);
        });
        
        mutate(formData)
        nav('/admin/listBlog');
    }
    return (
        <AnimatePresence>
            <motion.div
                initial={{scaleY: 0.9,opacity: 0}}
                animate={{scaleY: 1 ,opacity: 1}}
                exit={{scaleY: 0.9,opacity: 0}}
                transition={{duration: 0.3}}
            >
                <div className='w-[90%] mx-auto mt-[30px] shadow-md bg-white rounded mb-[40px]'>
                    <div className='flex items-center justify-between m-5 pt-[20px]'>
                        <span className='[&_h3]:text-xl w-full [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:uppercase'>
                            <h3>POST NEW</h3>
                        </span>
                        <span>
                            <Link to={`/admin/listBlog`}>
                                <Button className='text-[16px] font-sans' style={{height: 45, width: 150}} type='primary'><OrderedListOutlined /> LIST BLOG</Button>
                            </Link>
                        </span>
                    </div>
                    <Form
                        form={form}
                        onFinish={onFinish} 
                        layout='vertical' 
                        onValuesChange={(changedValues, allValues) => {
                            if ("title" in changedValues) {
                                const rawTitle = changedValues.title || "";
                                const generatedSlug = rawTitle
                                    .toLowerCase()
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .replace(/[^a-z0-9 ]/g, "")
                                    .trim()
                                    .replace(/\s+/g, "-");
                                form.setFieldsValue({ slug: generatedSlug })
                            }
                        }}
                        style={{margin: 20}} className='m-2 [&_Input]:h-[40px]'>
                        <div className='w-full flex'>
                            <span className='max-w-[700px]'>
                                <Form.Item label="Title" name="title" className="font-semibold" rules={[{required: true}]}>
                                    <Input style={{width: 700}}/>
                                </Form.Item>
                                <Form.Item label="Slug" name="slug" className="font-semibold" rules={[{required: true}]}>
                                    <Input style={{width: 700}}/>
                                </Form.Item>
                            </span>
                            <span className='ml-12'>
                                <Form.Item label='Category' name="category" className="font-semibold" rules={[{required: true}]}>
                                    <Select style={{height: 40, width: 335}} options={categoryOptions} placeholder="Chọn danh mục bài viết" />
                                </Form.Item>
                            </span>
                        </div>
                        <span className='flex items-center gap-40'>
                            <Form.Item name='thumbnail' className="font-semibold" label="Thumbnail" rules={[{required: true}]}>
                                {thumbnail && (
                                    <img src={typeof thumbnail === 'string'
                                        ? thumbnail.startsWith('http')
                                            ? thumbnail
                                            : `http://localhost:3000/uploads/${thumbnail}`
                                        : URL.createObjectURL(thumbnail)}
                                        alt='Thumbnail'
                                        style={{width: 200, marginBottom: 8}}
                                    />
                                )}
                                <Upload
                                    maxCount={1}
                                    beforeUpload={(file) => {
                                        setThumbnail(file); // Lưu file vào state
                                        return false; // Ngăn Upload tự động gửi
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item className="font-semibold" label="Status" name="status" rules={[{required: true}]}> 
                                <Radio.Group>
                                    <Radio value="draft">Draft</Radio>
                                    <Radio value="published">Published</Radio>
                                    <Radio value="archived">Archived</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </span>
                        <Form.Item label="Content" className='min-h-96 font-semibold' name="content" rules={[{required: true}]}>
                            <CKEditor
                                data={content}
                                editor={ClassicEditor as any}
                                onChange={(_, editor) => setContent(editor.getData())}
                            >
                            </CKEditor>
                        </Form.Item>
                        <Form.Item className="font-semibold" label="Excerpt" name="excerpt" rules={[{required: true}]}>
                            <Input />
                        </Form.Item>
                        <Form.Item className="font-semibold" label="Tags" name="tags" rules={[{ required: true }]}>
                            <Select mode="tags" style={{ width: '100%', height: 40}} placeholder="Nhập thẻ (nhấn Enter để thêm)">
                                {/* Không cần options vì người dùng tự gõ */}
                            </Select>
                        </Form.Item>
                        <Button
                            style={{width: 170, height: 40}}
                            htmlType='submit' 
                            type='primary'
                            className='mt-[10px] mb-[20px]'
                        >
                            Submit
                        </Button>
                        <Button
                            style={{width: 170, height: 40}}
                            htmlType='reset' 
                            danger
                            className='mt-[10px] mb-[20px] ml-3.5'
                        >
                            Cancel
                        </Button>
                    </Form>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default AddBlog