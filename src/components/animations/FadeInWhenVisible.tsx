import { useInView } from 'react-intersection-observer'
import React from 'react'
import { motion } from "framer-motion";

const FadeInWhenVisible = ({ children, duration = 0.5, delay = 0.2 }:any) => {
    const { ref, inView } = useInView({ // Correctly destructure both 'ref' and 'inView'
        triggerOnce: true,
        threshold: 0.2,
    });
    return (
        <motion.div
            ref={ref}
            initial={{ y: 80, opacity: 0 }} // Vị trí ban đầu: ẩn và ở dưới 50px
            animate={inView ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }} // Vị trí kết thúc: hiện và ở vị trí ban đầu
            transition={{ duration, delay }}
        >
            {children}   
        </motion.div>
    )
}

export default FadeInWhenVisible