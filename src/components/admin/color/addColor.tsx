import { DeleteColumnOutlined, MinusCircleOutlined, PlusOutlined, RestFilled, UploadOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputNumber, Select, Space, Upload } from 'antd';
import { ChartColumnStacked, CircleX } from 'lucide-react';
import React, { useState } from 'react';

const VariantForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([
    {
      name: '',
      hex: '',
      price: '',
      image: {
        url: '',
        alt: ''
      },
      sizes: [{ size: '', stock: '' }]
    }
  ]);

  return (
    <div className='ml-10 mr-10 mt-[30px] shadow-md bg-white rounded-xl mb-[40px]'>
      <div className='w-[96%] mx-auto pt-8'>
        <h2 className='text-2xl font-bold flex items-center'><ChartColumnStacked style={{width: 24}} className='mr-2' /> Tạo Biến Thể Sản Phẩm</h2>
      </div>
      
      <Form 
        form={form} 
        layout="vertical" autoComplete="off"
        style={{margin: 16}} className='[&_Input]:h-[40px]'  
      >
        <Form.List name="colors" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, colorIndex) => (
                <div
                  key={key}
                  style={{
                    padding: 12,
                    marginBottom: 24,
                    borderRadius: 8
                  }}
                >
                  <h4 className='text-xl font-semibold font-sans'>Màu #{colorIndex + 1}</h4>

                  <Form.Item {...restField} name={[name, 'productId']} label="Sản phẩm" rules={[{required: true}]}>
                    <Select placeholder="VD: *****" />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, 'name']} label="Tên màu" rules={[{required: true}]}>
                    <Input placeholder="VD: Trắng" />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, 'hex']} label="Mã màu HEX">
                    <Input placeholder="VD: #FFFFFF" />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, 'price']} label="Giá cho màu này" rules={[{required: true, min: 0}]}>
                    <InputNumber placeholder="VD: 1200000" style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, 'image', 'file']} label="Ảnh đại diện màu" rules={[{required: true}]}>
                    <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                      <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item {...restField} name={[name, 'image', 'alt']} label="Alt ảnh">
                    <Input placeholder="VD: Giày trắng" />
                  </Form.Item>

                  <Divider>Danh sách size</Divider>

                  <Form.List name={[name, 'sizes']} initialValue={[{}]}>
                    {(sizeFields, { add: addSize, remove: removeSize }) => (
                      <>
                        {sizeFields.map(({ key: sizeKey, name: sizeName, ...sizeRestField }) => (
                          <Space key={sizeKey} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item {...sizeRestField} name={[sizeName, 'size']} rules={[{ required: true, message: 'Vui lòng nhập size' }]}>
                              <Input placeholder="Size (VD: 39)" />
                            </Form.Item>
                            <Form.Item {...sizeRestField} name={[sizeName, 'stock']} rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
                              <InputNumber placeholder="Số lượng" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => removeSize(sizeName)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => addSize()} block icon={<PlusOutlined />}>
                            Thêm size
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Button danger type="link" onClick={() => remove(name)}>
                    <CircleX /> Xoá màu này
                  </Button>
                </div>
              ))}

              <Form.Item>
                <Button  type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm màu
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item >
          <Button className='mb-4 w-3xs' style={{height: 40}} type="primary" htmlType="submit">Gửi</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VariantForm;
