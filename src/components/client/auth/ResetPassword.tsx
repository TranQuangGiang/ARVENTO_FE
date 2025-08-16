import { Button, Form, Input } from 'antd'
import { AnimatePresence } from 'framer-motion';
import { useResetPassword } from '../../../hooks/useResetPassword';
import { useNavigate, useSearchParams } from 'react-router-dom';


const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const nav = useNavigate();
    
    const { mutate } = useResetPassword({
        resource: "/auth/reset-password",
        onSuccess: () => {
            nav('/?modal=login')
        } ,
    })
    const onFinish = (values:any) => {
        if (!token) {
            // bạn có thể redirect hoặc thông báo lỗi tại đây
            console.error("Token không tồn tại");
            return;
        }
        mutate({ 
            newPassword: values.password, 
            token 
        });
    }
    return (
        <AnimatePresence>
            <div className="p-6 w-full max-h-screen">
                <div className='w-[50%] mx-auto '>
                    <div className='[&_img]:w-1/3 [&_img]:mx-auto [&_img]:mb-0'>
                        <img src="/resetpassword.jpg" alt="" />
                    </div>
                    <span className='w-[30%] mx-auto text-center pb-3.5'>
                        <h2 className="text-xl font-bold font-sans mb-4 text-center leading-1">Quên mật khẩu</h2>
                        <p className='text-[15px] w-[60%] mx-auto text-gray-700 font-sans font-semibold mb-3.5'>Vui lòng nhập mật khẩu mới để hoàn tất quá trình đặt lại mật khẩu và truy cập lại vào tài khoản của bạn.</p>    
                    </span>
                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item label="Mật khẩu mới" name="password" hasFeedback rules={[{required: true, min: 6}]}>
                            <Input.Password className="w-[300px] relative pl-24 h-[40px]" placeholder="password"/>    
                        </Form.Item>
                        <Form.Item label="Nhập lại mật khẩu" name="confirmPassword" dependencies={["password"]} hasFeedback
                            rules={[{required: true}, 
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        } 
                                        return Promise.reject(new Error("Mật khẩu không khớp"));
                                    }
                                })
                            ]}
                        >
                            <Input.Password className="w-[300px] relative pl-24 h-[40px]" placeholder="Nhập lại mật khẩu"/>
                        </Form.Item>   
                        <Form.Item className='w-full flex justify-center'>
                            <Button className="mt-2.5 w-full mx-auto" type='primary' htmlType='submit' style={{height: 40,  width: 400}}>Đặt lại mật khẩu</Button>    
                        </Form.Item>                           
                    </Form>
                </div>
            </div>
        </AnimatePresence>
        
    )
}

export default ResetPassword