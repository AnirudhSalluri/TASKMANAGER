import React from 'react'
import { useForm } from 'react-hook-form'
import Textbox from '../components/Textbox'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../redux/slices/apiSlice'
import { setCredentials } from '../redux/slices/authSlice'
import { useDispatch } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'


const Login = () => {
  const {register , handleSubmit , formState:{errors}}= useForm() 
  const navigate = useNavigate();
  const [login ,{isLoading, error}] = useLoginMutation();
  const dispatch = useDispatch();
  const onSubmit =async (data)=>{
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials(response))
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.data.message);
    }
        
  }
  const registercall =()=> {
    navigate("/register")
  }

  return (
    <div className="bg-amber-50 h-screen flex items-center justify-center">

      {/* Left image section */}
      <div 
        style={{ backgroundImage: "url('/image.png')" }} 
        className="opacity-80 bg-cover bg-center w-full md:w-1/2 h-full hidden md:block"
      ></div>
      
      {/* Right login form section */}
      <div className="bg-neutral-50 w-full md:w-1/2 h-full shadow-2xl p-6 sm:p-10 md:p-20 flex flex-col gap-y-5 items-center justify-center">
        
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Log in</h2>
        
        <form 
          className="flex flex-col gap-6 bg-blue-50 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-lg mx-auto" 
          onSubmit={handleSubmit(onSubmit)}
        >
          <Textbox
            name="email"
            placeholder="Enter Your Email"
            type="email"
            register={register("email", { required: "Email is required" })}
            error={errors.email ? errors.email.message : ""}
          />

          <Textbox
            name="password"
            placeholder="Enter Your Password"
            type="password"
            register={register("password", { required: "Password is required" })}
            error={errors.password ? errors.password.message : ""}
          />
          
          <div className="text-center text-sm mt-2">
            <span>Don't have an account? 
              <span 
                className="underline text-blue-500 cursor-pointer" 
                onClick={registercall}
              >
                Register here
              </span>
            </span>
          </div>
          
          {isLoading ? (
            <span className="text-center">Loading...</span>
          ) : (
            <Button type="submit" tag="Log in" />
          )}
        </form>
        
        <ToastContainer />
      </div>
    </div>
  )
}

export default Login
