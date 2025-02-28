
import{useState} from 'react';
import {motion} from "framer-motion";
import {Button} from "../../components/ui/button"
import {Input} from "../../components/ui/input"
import {Checkbox} from "../../components/ui/checkbox"
import {Label} from "../../components/ui/label"
import {Eye, EyeOff, Github, Mail} from "lucide-react"

import React from 'react'

export default function Login() {

    const [email,setEmail] =useState('');
    const [password,setPassword] = useState("");
    const [showPassword,setShowPassword]= useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-300 flex items-center justify-center p-4 '>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        className='w-full max-w-md'
      >

        <div className="bg-green-600 rounded-3xl shadow-xl ring-2 ring-green-600/50 shadow-green-800/50 p-8 space-y-6">
            <div className="text-center space-y-2">
                <h1 className='text-white text-3xl font-bold tracking-tighter'>Welcome Back</h1>
                <p className='text-green-50'>Enter Your Credentials to acess your account</p>
            </div>
            <form action="" className='space-y-4'>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input id='email' type='email' placeholder='testYoutube@gmail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='bg-white'
                    required 
                    /> 
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                        <Input id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='bg-white'
                         required
                         />
                         <button type='button'
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                         </button>
                    </div>
                </div>
                <div className="flex items-center  justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox id='remember' className='bg-white'/>
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <a href="#" className='text-sm text-primary-500 hover:text-primary-600'>
                        Forgot password?
                    </a>
                </div>
                <Button type="submit" className='w-full'>
                    Sign in
                </Button>
            </form>
            {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
            

                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground rounded-2xl">Or continue with </span>
                </div>
            </div> */}
            {/* <div className="grid grid-cols-2 gap-4" >
                <Button variant="outline" className='w-full'>
                    <Github className="mr-2 h-4 w-4" />
                    Github
                </Button>
                <Button variant="outline" className='w-full'>
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                </Button>
            </div> */}
            <div className='text-center text-sm'>
                Don't have an account?{" "}
                <a href="#" className='text-primary-500 hover:text-primary-600 font-medium'>Register</a>
            </div>
        </div>

      </motion.div>
    </div>
  )
}
