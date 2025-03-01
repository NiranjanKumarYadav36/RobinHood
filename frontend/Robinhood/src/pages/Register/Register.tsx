import React, { useState } from 'react'
import { motion } from "framer-motion"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { ComboBox } from "./combobox"

function Register() {
  const [firstName, setFirstName] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // State for ComboBox selections
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedRole, setSelectedRole] = useState("")

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-300 to-green-50 flex items-center justify-center p-4 '>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        className='w-full max-w-md'
      >
        <div className="bg-green-600 rounded-3xl shadow-xl ring-2 ring-green-600/50 shadow-green-800/50 p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className='text-white text-3xl font-bold tracking-tighter'>Hello There!</h1>
            <p className='text-green-50'>Enter Your Details to Register</p>
          </div>
          
          {/* Main Form */}
          <form action="" className='space-y-4'>
            <div className="space-y-3">
              <Label htmlFor="firstName" className="text-white">Name</Label>
              <div >
                <Input id='firstName' type='text' placeholder='First Name'
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className='bg-white' required
                /> 
               
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input id='email' type='email' placeholder='testYoutube@gmail.com'
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className='bg-white' required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className='bg-white' required
                  />
                  <button type='button' onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Updated ComboBox Usage */}
              <div className='grid grid-cols-2 gap-7'>
                <ComboBox title="State" width='w-[178px]' value={selectedState} onSelect={setSelectedState} />
                <ComboBox title="City" width='w-[178px]' value={selectedCity} onSelect={setSelectedCity} />
              </div>

              <div className='grid grid-cols-1'>
                <ComboBox title="Role" width='w-[385px]' value={selectedRole} onSelect={setSelectedRole} />
              </div>

              <br />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
              </div>
              <br />

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className='w-full text-green-600'>Sign in</Button>
                <Button variant="default" className='w-full text-green-600' type='submit'>Register</Button>
              </div>
            </div>
          </form>

        </div>
      </motion.div>
    </div>
  )
}

export default Register
