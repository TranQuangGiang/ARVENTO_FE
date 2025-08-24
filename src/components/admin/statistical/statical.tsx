import FadeInWhenVisible from '../../animations/FadeInWhenVisible'
import TopSellingProducts from '../dashboard/topSellDingProduct'
import CharOrderStatistics from './orderStatistics'
import ProductReviewStatistics from './ProductReviewStatistics'
import RevenueChart from './renvues'


const Statistical = () => {
    return (
        <div className='ml-6 mr-6 mt-10 mb-10'>
            <RevenueChart />
            
            <FadeInWhenVisible>
                <div className='w-[full]'>
                    <ProductReviewStatistics />
                </div>
            </FadeInWhenVisible>
            

            <FadeInWhenVisible>
                <div className='w-full mt-10 flex items-center gap-8'>
                    <div className='w-[50%]'>
                        <CharOrderStatistics />
                    </div>
                </div>
            </FadeInWhenVisible>
           
            
        </div>
    )
}

export default Statistical