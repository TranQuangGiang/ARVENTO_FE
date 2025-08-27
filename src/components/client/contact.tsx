import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Clock } from 'lucide-react';
import { AnimatePresence,motion } from 'framer-motion';

const Contact = () => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >   
                    <div className="max-w-[76%] mx-auto py-12 px-6 mb-15 mt-5">
                        <h2 className="text-2xl font-bold text-center mb-10">Liên hệ với chúng tôi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-5">
                            
                            {/* Map */}
                            <div className="overflow-hidden rounded-2xl shadow-lg">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.322263296094!2d105.76976357503003!3d20.97971528065732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134532e605c47b3%3A0xab1942e7f924553d!2zxJDGsOG7nW5nIFbhuqFuIFBow7pjLCBIw6AgxJDDtG5nLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1756308784555!5m2!1svi!2s" 
                                    width="600" 
                                    height="450" 
                                    allowFullScreen
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>

                            {/* Thông tin liên hệ */}
                            <div className=" text-black flex flex-col ">
                                <h3 className="text-[18px] font-semibold mb-6 text-gray-900">Thông tin cửa hàng</h3>
                                <div className="space-y-4">
                                    <p className="flex text-[15px] items-center gap-1.5">
                                        <MapPin size={18} /><span>Địa chỉ: </span> Đường Vạn Phúc, Làng Vạn Phúc, TP Hà Nội
                                    </p>
                                    <p className="flex text-[15px] items-center gap-1.5">
                                        <Phone size={18} /> <span>Hotline: </span> +84 961 918 362
                                    </p>
                                    <p className="flex text-[15px] items-center gap-1.5">
                                        <Mail size={18} /> <span>Email: </span> arvento@gmail.com
                                    </p>
                                    <p className="flex text-[15px] items-center gap-1.5">
                                        <Clock size={18} /> <span>Giờ mở cửa: </span> Từ 8h00 - 21h00 (T2 - CN)
                                    </p>
                                </div>
                                <div className=" mt-6">
                                    <h3 className='text-[18px] font-semibold mb-6 text-gray-900'>Panpage cửa hàng</h3>
                                    <div className='flex items-center gap-4'>
                                        <a href="#" className="hover:text-blue-500 transition">
                                            <Facebook size={24} />
                                        </a>
                                        <a href="#" className="hover:text-pink-500 transition">
                                            <Instagram size={24} />
                                        </a>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
        
    );
};

export default Contact;
