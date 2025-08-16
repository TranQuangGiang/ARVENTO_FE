import { UnorderedListOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Select, Upload } from 'antd'
import { useUpdate } from '../../../../hooks/useUpdate';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useOneData } from '../../../../hooks/useOne';
import { useEffect, useState } from 'react';

const UpdateVariants = () => {
  const [form] = Form.useForm();
  const { id,productId } = useParams();
  const [productImages, setProductImages] = useState([]);
  const nav = useNavigate();

  const { data:variants, isLoading } = useOneData({
    resource: `/variants/products/${productId}/variants`,
    _id: id
  });
  console.log(variants);
  
  const { data:product } = useOneData({
    resource: `/products`,
    _id: productId
  })
  
  useEffect(() => {
    if (variants?.data && product?.data?.images) {
      const currentIndex = product.data.images.findIndex(
        (img:any) => img.url === variants.data.image?.url
      )
      
      let currentSalePrice = 0; // Mặc định là 0
      if (variants.data.sale_price && typeof variants.data.sale_price.$numberDecimal === 'string') {
        const parsedSalePrice = parseFloat(variants.data.sale_price.$numberDecimal);
        if (!isNaN(parsedSalePrice)) {
          currentSalePrice = parsedSalePrice;
        }
      }

      form.setFieldsValue({
        imageIndex: currentIndex !== -1 ? currentIndex : undefined,
        stock: variants.data.stock,
        price: parseFloat(variants.data.price || 0),
        sale_price: currentSalePrice,
      });
    }    
  }, [variants , product, form])
  
  const { mutate } = useUpdate({
    resource: `/variants/products/${productId}/variants`,
    _id: id
  })

  const onFinish = (values:any) => {
    const selectedImage = product?.data?.images?.[values.imageIndex];

    const formData = new FormData();
    if (selectedImage) {
      formData.append("image", JSON.stringify({
        url: selectedImage.url,
        alt: selectedImage.alt
      }))
    }
      formData.append('imageIndex', String(values.imageIndex));
      formData.append('stock', values.stock);
      formData.append('price', values.price);
      formData.append('sale_price', values.sale_price);
    mutate(formData, {
      onSuccess: () => {
        nav(`/admin/listVariants/${productId}`);
      },
      onError: () => {
        message.error("Cập nhật thất bại!");
      }
    });
  }
  return (
    <div className="w-[95%] mx-auto mt-[30px] min-h-screen shadow-md bg-white rounded-xl mb-[40px]">
      <div className="w-full pt-[20px]">
        <div className='flex justify-between'>
          <span>
            <h3 className="pl-[20px] text-2xl font-semibold mb-1">Cập nhập biến thể</h3>
            <p className="pl-[20px] text-sm text-gray-500 mb-6">Điền thông tin chi tiết về các biến thể</p>
          </span>
          <Link to={`/admin/listVariants/${productId}`}>
            <Button className='mt-2 mr-10' type='primary' style={{height: 40}} icon={<UnorderedListOutlined />}>Danh sách</Button>
          </Link>
        </div>
        <hr className="border-t border-gray-300 mb-6 -mt-3" />
      </div>
      <div className='flex items-center'>
        <div className='flex items-center gap-6 ml-6'>
          <p style={{ margin: 0 }}>Màu:</p>
          <p style={{ margin: 0 }}>{variants?.data?.color?.name}</p>
        </div>
        <div className='flex items-center gap-6 ml-20 '>
          <p style={{ margin: 0 }}>Size:</p>
          <p style={{ margin: 0 }}>{variants?.data?.size}</p>
        </div>
      </div>
      <Form
        layout="vertical" 
        form={form} 
        onFinish={onFinish}
        style={{margin: 20}} className='m-2 [&_Input]:h-[40px]'
      >
        <Form.Item
          label="Ảnh"
          name="imageIndex"
          rules={[{ required: true, message: "Please upload product images" }]}
        >
          <Select
            style={{height: 50}}
            placeholder="Chọn ảnh"
            options={product?.data?.images?.map((img:any, index:any) => ({
              label: (
                <div className="flex items-center gap-2">
                  <img src={img.url} alt={img.alt} className="w-10 h-10 object-cover rounded" />
                  <span>{img.alt}</span>
                </div>
              ),
              value: index
            }))}
          />
        </Form.Item>
        <Form.Item label="Giá gốc" name="price">
          <InputNumber style={{width: "100%"}} disabled />
        </Form.Item>
        <Form.Item label="Giá khuyến mãi" name="sale_price" >
          <InputNumber style={{width: "100%"}} min={0} placeholder='0đ' />
        </Form.Item>
        <Form.Item label="Số lượng" name="stock" rules={[{required: true}]}>
          <InputNumber style={{width: "100%"}} />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end space-x-3 mb-6 mt-6">
            <Button 
              type="primary"  
              htmlType="submit"
              loading={isLoading}  
              style={{height: 40, width: 200}}
            >
              Lưu
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()} disabled={isLoading} style={{height: 40}}>
              Đặt lại
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UpdateVariants