'use client'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader, Mail } from 'lucide-react'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {FaGoogle} from'react-icons/fa'

const AnimatedBackground = () =>{
    return (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">

            <defs>
                <linearGradient id="gradient" x1='0%' x2={'100%'} y1={'0%'} y2={'100%'}>
                    <stop offset='0%' stopColor="#ff7f50" stopOpacity='0.2' />
                    <stop offset='100%' stopColor="#ff6347" stopOpacity='0.2' />
                </linearGradient> 
            </defs>
            <rect width='100%' height='100%' fill="url(#gradient" />
            {[ ...Array(20)].map((_,i)=>(
                <motion.circle key={i} r={Math.random() * 20 +10} fill="#ffff"
                initial={{ opacity: Math.random() * 0.5 + 0.1,
                    y: Math.random() * 100 + "%",
                    x: Math.random() * 100 + "%",
                }}
                animate={{
                    y: Math.random() * 100 + "%",
                    x: Math.random() * 100 + "%",
                }}
                transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, repeatType:"reverse",}} />
            ))}
        </svg>
    )
};

const Login = ()  =>{
    const router = useRouter()
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState('')
    const [user,setUser] = useState({
        email:'',
        password:'',
        
    });
    const [showPassword,setShowPassword] = useState(false);
   
    // handle input changes when a use i type in the input field
    const handleInputChange = (e)=>{
        
        const {name,value}= e.target;

        setUser((prevInfo)=>({...prevInfo,[name]: value}))
    }
    // handle submit form
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if(!user.email || !user.password ){
                setError("Please fill all the field ")
                return
            }
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if(!emailRegex.test(user.email)){
                setError("Please enter a valid email")
                return
            }
            if(password !== user.password){
                setError("Invalid Password")
            }
           
                // sign in the user
                const res = await signIn('credentials',{
                    email:user.email,
                    password: user.password,
                    redirect:false,
                });
                if(res?.error){
                    console.log(res)
                    setError("Something went wrong in singIn user")
                }else{
                    router.push('/dashboard')
                }

        } catch (error) {
            console.log(error)
            setError(error.response?.data?.error || " Error server")
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen overflow-hidden bg-blue-200 relative'>
            <AnimatedBackground/>
            <motion.div initial={{ opacity:0, y:-30}}
            animate={{ opacity:1, y:0}}
            transition={{ duration:0.4}}
            className='bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative z-10'>

                <div className='text-center mb-8'>
                    <Image src='/logo1.png' width={80} height={80} alt='logo' className='mx-auto mb-4' />
                    <h3 className='text-3xl text-gray-900'>Sign In To Account</h3>
                    
                </div>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    
                    <div className='relative'>
                    <Mail className='absolute w-5 h-5 left-3 top-2 text-yellow-400'/>
                        <Input type='email' name='email' id='email' placeholder='Enter email..'
                        onChange={handleInputChange} value={user.email} required className='px-10 border-green-400'/>
                    </div>
                    <div className='relative'>
                    {showPassword ? (
                   <Eye 
                            onClick={() => setShowPassword(false)} 
                            className='absolute w-5 h-5 left-3 top-2 text-yellow-400 cursor-pointer'
                            />
                        ) : (
                        <EyeOff 
                            onClick={() => setShowPassword(true)} 
                        className='absolute w-5 h-5 left-3 top-2 text-yellow-400 cursor-pointer'
                        />
                        )}
                        <Input type={showPassword ? 'text' : 'password'} name='password' id='password' placeholder='Enter password'
                        onChange={handleInputChange} value={user.password} required className='px-10 border-green-400'/>
                    </div>
                    
                    <Button variant='default' type='submit' disabled={loading}
                    className='w-full bg-amber-400 hover:bg-amber-600'>
                        {loading ? (
                            <div className='block'>
                                <Loader className='mr-2 h-4 w-4 animate-spin' />
                            </div>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </Button>
                </form>
                <div className='mt-6'>
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div  className='w-full border-t border-gray-400'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-yellow-200'>Or Sign In with</span>
                            </div>
                        </div>
                        <div  className='mt-6'>
                            <Button onClick={()=> signIn('google')}
                                className='w-full bg-green-500 hover:bg-green-600'>
                                    <FaGoogle className='mr-2 h-4 w-4' />Sign In with Google
                            </Button>
                        </div>
                </div>
                <p className='mt-4'>Don&apos;t have an account? <Link href='/signup' className='text-blue-500'>Sign Up</Link></p>

            </motion.div>
        </div>
    )

};
 export default Login;