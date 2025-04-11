// import { a } from 'framer-motion/dist/types.d-B50aGbjN';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'

const Footer = () => {
    const socialLinks =[
        {
            Icon:FaFacebook,
            href:'https://www.facebook.com',
            color:'blue',
        },
        {
            Icon:FaTwitter,
            href:'https://www.twitter.com',
            color:'blue',
        },
        {
            Icon:FaInstagram,
            href:'https://www.instagram.com',
            color:'blue',
        },
        {
            Icon:FaLinkedinIn,
            href:'https://www.facebook.com',
            color:'blue',
        },
        {
            Icon:FaGithub,
            href:'https://www.github.com',
            color:'blue',
        },
    ];
  return (
    <footer className='bg-gradient-to-r from-gray-900 to-gray-800 text-white'>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                {/* brand description  */}
                <div className='space-y-4'>
                    <h2 className='text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary'>E-Store</h2>
                    <p>Creating the estore is a great way to get started to buy!.</p>
                </div>
                {/* quick link  */}
                <div>
                    <h3 className='text-lg mb-4 border-b border-gray-700 pb-2'>Quick Links</h3>
                    <ul className='space-y-2'>
                        {["Home","Blog","About","Contact"].map((item)=>(
                            <li key={item}>
                                <Link href={item.toLowerCase() === "home" ? `/` : `/${item.toLowerCase()}`}
                                className='text-gray-400 hover:text-white transition duration-300'>
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* customer service  */}
                <div>
                    <h3 className='mb-4 text-lg border-b pb-2 border-gray-700'>Customer Services</h3>
                    <ul className='space-y-2'>
                        {["FAQ","Shipping & Return","Warranty","Privacy Policy"].map((item)=>(
                            <li key={item}>
                                <Link href={`/${item.toLowerCase().replace("&","-").replace(" "," ")}`}
                                className='text-gray-400 hover:text-white transition duration-300'>
                                        {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* newsletter  */}
                <div>
                    <h1 className='text-lg mb-4 border-b pb-2 border-gray-700'>Stay Connected</h1>
                    <p>Follow us on social media to get the latest updates on our products and services.</p>
                    <form className='flex items-center'>
                        <input type="email" placeholder='Enter email'
                        className='flex-grow px-4 py-2 bg-gray-700 text-white rounded-l-md outline-none' />
                        <button className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-r-lg transition duration-300'>
                            <Mail className='w-5 h-5' />
                        </button>
                    </form>
                </div>
            </div>
            {/* social media copy right  */}
            <div className='mt-8 pt-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center'>
                <div className='flex space-x-4 sm:mb-0'>
                        {socialLinks.map(({Icon,href,color},index)=>(
                            <a href={href} key={index} target='_blank' rel='noopener noreferrer' 
                            className='text-green-400 hover:text-yellow-500 transition duration-300' >
                                <Icon className='w-5 h-5' />
                            </a>
                        ))}
                </div>
                <p className='text-gray-400 text-sm'>
                        @{new Date().getFullYear()} E-Store. All right reserved
                </p>

            </div>
        </div>
    </footer>
  )
};

export default Footer