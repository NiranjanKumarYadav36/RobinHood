import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { ComboBox } from "./combobox";
import { useNavigate } from 'react-router-dom';
import axiosclient from '../../components/ui/AxiosClient/axiosclient';
import Header from "../../components/ui/Header/header";

function Register() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    axiosclient.get('/states')
      .then(response => setStates(response.data))
      .catch(error => console.error("Error fetching states:", error));
  }, []);

  useEffect(() => {
    if (selectedState) {
      axiosclient.get(`cities/${selectedState}`)
        .then(response => setCities(response.data))
        .catch(error => console.error("Error fetching cities:", error));
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosclient.post('/register', {
        name,
        email,
        password,
        phone,
        role: selectedRole.toLowerCase(),
        state: selectedState,
        city: selectedCity
      });
      console.log("Registration Successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-800">
      {/* ✅ Header is now at the top */}
      <Header />

      {/* ✅ Registration Form is centered properly */}
      <div className='flex items-center justify-center min-h-[calc(100vh-64px)] p-4'>
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.75 }} 
          className='w-full max-w-md'
        >
          <div className="bg-gray-900 rounded-3xl shadow-xl ring-2 ring-gray-900/50 shadow-gray-900/50 p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className='text-white text-3xl font-bold tracking-tighter'>Hello There!</h1>
              <p className='text-green-50'>Enter Your Details to Register</p>
            </div>
            
            <form onSubmit={handleRegister} className='space-y-4'>
              <Label className="text-white">Name</Label>
              <Input className="bg-white" type='text' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} required />
              
              <Label className="text-white">Email</Label>
              <Input className="bg-white" type='email' placeholder='test@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} required />
              
              <Label className="text-white">Phone</Label>
              <Input className="bg-white" type='text' placeholder='Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)} required />
              
              <Label className="text-white">Password</Label>
              <div className="relative">
                <Input className="bg-white" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 items-center ">
                {/* State Selection */}
                <div className="flex flex-col space-y-2">
                  <Label className="text-white">State</Label>
                  <ComboBox title="State" value={selectedState} onSelect={setSelectedState} options={states} />
                </div>

                {/* City Selection */}
                <div className="flex flex-col space-y-2">
                  <Label className="text-white">City</Label>
                  <ComboBox title="City" value={selectedCity} onSelect={setSelectedCity} options={cities} />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label className="text-white">Role</Label>
                  <ComboBox title="Role" value={selectedRole} onSelect={setSelectedRole} options={["sponsor", "volunteer", "volunteer_t2"]} />
                </div>
              </div>
                
                <br />

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className='w-full text-cyan-600' onClick={() => navigate("/login")}>Sign in</Button>
                <Button className='w-full bg-cyan-950 text-white hover:bg-cyan-900' type='submit'>Register</Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
