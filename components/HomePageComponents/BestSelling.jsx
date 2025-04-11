import React, { useEffect, useState } from 'react'
import bag1 from '@/public/bag1.avif'
import bag2 from '@/public/bag2.avif'
import jacket1 from '@/public/jacket1.jpg'
import jacket2 from '@/public/jacket2.jpg'
import Jeans1 from '@/public/Jeans1.webp'
import jeans2 from '@/public/jeans2.avif'
import sg1 from '@/public/sglass1.avif'
import sg2 from '@/public/sglass2.avif'
import shoes1 from '@/public/shoes2.jpg'
import shoes2 from '@/public/shoes3.avif'
import suit1 from '@/public/suit1.webp'
import suit2 from '@/public/suit2.avif'
import { ChevronLeft } from 'lucide-react'

const BestSelling = () => {
    const [ watches,setWatches ] = useState([]);
    const [currentIndex, setCurrentIndex ] = useState(0);

    useEffect(()=>{
        const fetchedProducts = [
            {
                id: 1,
                name:"Bags for ladies washed denim",
                price:800,
                rating:5,
                image: bag1,
                link:'/products/brand/Bags'
            },
            {
                id: 2,
                name:"Bags for women stylist",
                price:1000,
                rating:4.6,
                image: bag2,
                link:'/products/brand/Bags'
            },
            {
                id: 3,
                name:"Jacket for men of washed denim",
                price:4000,
                rating:4.8,
                image: jacket1,
                link:'/products/brand/Jacket'
            },
            {
                id: 4,
                name:"jacket for woment of washed denim",
                price:1100,
                rating:5,
                image: jacket2,
                link:'/products/brand/Jacket'
            },
            {
                id: 5,
                name:"suit for casul used fabric material",
                price:2000,
                rating:4.7,
                image: suit1,
                link:'/products/brand/Suit'
            },
            {
                id: 6,
                name:"Suit for women casual user of washed denim",
                price:2500,
                rating:5,
                image: suit2,
                link:'/products/brand/Suit'
            },
            {
                id: 7,
                name:"Sport shoes ",
                price:1500,
                rating:4.9,
                image: shoes1,
                link:'/products/brand/Shoes'
            },
            {
                id: 8,
                name:"Shoew Party of pure lather",
                price:3000,
                rating:4.8,
                image: shoes2,
                link:'/products/brand/Shoes'
            },
            {
                id: 9,
                name:"Sun glass of rain-bon",
                price:700,
                rating:4.4,
                image: sg1,
                link:'/products/brand/SunGlass'
            },
            {
                id: 10,
                name:"Sun glass of parada brand",
                price:1100,
                rating:5,
                image: sg2,
                link:'/products/brand/SunGlass'
            },
            {
                id: 11,
                name:"Jeans of washed denim",
                price:1500,
                rating:5,
                image: jeans2,
                link:'/products/brand/Jeans'
            },
        ].filter((product)=> product && product.image);
        setWatches(fetchedProducts)
    },[]);

    const nextWatch = () =>{
        setCurrentIndex((preIndex)=>(preIndex + 1 ) % watches.length);

    }
    const preWatch = () =>{
        setCurrentIndex((preIndex)=>(preIndex + 1 | watches.length)% watches.length);
    }
    const getWatcheIndex = (offset) =>{
        (currentIndex + offset + watches.length) % watches.length
    }
    if(watches.length === 0){
        return null;
    }

  return (
    <section className='py-8 md:py-16 bg-gray-100'>
        <div className='container mx-auto px-4'>
            <h2 className='text-2xl md:text-3xl lg:text-4xl text-center mb-8 md:mb-12'>
                Best Sellin Products
            </h2>
            <div className='relative'>
                <button onClick={preWatch} className='absolute left-4 top-1/2 p-1
                  transform -translate-y-1/2 z-20 bg-white/50 rounded-full'>
                        <ChevronLeft className='w-5 h-5 md:w-8 md:h-0' />
                </button>
                <div className='flex items-center sm:h-[27rem] h-[35rem] justify-center overflow-hidden'>
                {Array.from({ length: 5}).map((_,offset)=>{
                    const watch = watches[getWatcheIndex(offset)];
                    if(!watch) return null
                })}
                </div>
            </div>
        </div>
    </section>
  )
}

export default BestSelling