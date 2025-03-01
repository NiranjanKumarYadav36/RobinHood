import { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import axiosclient from '../../components/ui/AxiosClient/axiosclient';

export default function Login() {
    const navigate = useNavigate(); // Hook for navigation

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError(""); // Reset error message
        try {
            const response = await axiosclient.post("/login", {
                email,
                password
            });
            console.log("Login Successful:", response.data);
            navigate("/dashboard"); // Redirect to dashboard 
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-300 flex items-center justify-center p-4'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
                className='w-full max-w-md'
            >
                <div className="bg-green-600 rounded-3xl shadow-xl ring-2 ring-green-600/50 shadow-green-800/50 p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className='text-white text-3xl font-bold tracking-tighter'>Welcome Back</h1>
                        <p className='text-green-50'>Enter Your Credentials to access your account</p>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <form onSubmit={handleLogin} className='space-y-4'>
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
                                    type={showPassword ? "text" : "password"}
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
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id='remember' className='bg-white' />
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
                    <div className='text-center text-sm'>
                        Don't have an account? {" "}
                        <Link to="/register" className='text-primary-500 hover:text-primary-600 font-medium'>Register</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}