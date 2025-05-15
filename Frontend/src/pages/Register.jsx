import React from 'react'
import { useForm } from 'react-hook-form'
import Textbox from '../components/Textbox'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { useRegisterUserMutation } from '../redux/slices/apiSlice'
import { toast, ToastContainer } from 'react-toastify'

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()
  const navigate = useNavigate()
  const [registerUser, { isLoading }] = useRegisterUserMutation()

  const onSubmit = async (data) => {
    const userdata = {
      "name": data.name,
      "email": data.email,
      "password": data.password,
      "role": data.role,
      "title": data.title,
      "isAdmin": false
    }
    try {
      await registerUser(userdata).unwrap()
      toast.success("User Registered Successfully")
      reset()
    } catch (error) {
      toast.error(error.data.message)
    }
  }

  const registercall = () => {
    navigate("/log-in")
  }

  const password = watch("password")

  return (
    <div className='bg-amber-50 h-screen flex items-center justify-center'>

      {/* Left image section */}
      <div 
        style={{ backgroundImage: "url('/image.png')" }} 
        className='opacity-80 bg-cover bg-center w-full md:w-1/2 h-full hidden md:block'
      ></div>
      
      {/* Right Register form section */}
      <div className='bg-neutral-50 w-full md:w-1/2 h-full shadow-2xl p-6 sm:p-10 md:p-20 flex flex-col gap-y-5 items-center justify-center'>
        
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Register</h2>
        
        <form 
          className='flex flex-col gap-6 bg-blue-50 p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-lg mx-auto' 
          onSubmit={handleSubmit(onSubmit)}
        >

          <Textbox
            name="name"
            placeholder="Enter Your Name"
            type="text"
            register={register("name", { required: "Name is required" })}
            error={errors.name ? errors.name.message : ""}
          />

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

          <Textbox
            name="confirm-password"
            placeholder="Confirm Your Password"
            type="password"
            register={register("Cpassword", {
              required: "Confirm password is required",
              validate: (value) => value === password || "Passwords do not match"
            })}
            error={errors.Cpassword ? errors.Cpassword.message : ""}
          />

          {/* Hidden input fields */}
          <input className='hidden' value="user" {...register("role")} />
          <input className='hidden' value="not defined" {...register("title")} />
          <input value={true} className='hidden' {...register("isActive")} />
          <input className='hidden' value={false} {...register("isAdmin")} />

          <span className="text-center text-sm mt-2">
            Already have an account? 
            <span 
              className='underline text-blue-500 cursor-pointer' 
              onClick={registercall}
            >
              Login
            </span>
          </span>

          {isLoading ? (
            <span className="text-center">Loading...</span>
          ) : (
            <Button type="submit" tag="Register" />
          )}
        </form>

        <ToastContainer />
      </div>
    </div>
  )
}

export default Register
