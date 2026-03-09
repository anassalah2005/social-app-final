import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Eye, EyeSlash } from 'iconsax-reactjs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'
import ErrorMessege from '../../components/ErrorMessege/ErrorMessege'




  const schema = z.object({
        name:z.string("zod: must be a string with 3-12 characters").regex(/^[a-zA-Z0-9]{3,12}$/, "zod: must be a string with 3-12 characters" ),
    email:z.email( "must be a valid email address"),
    password:z.string("must be a valid password").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ , "must be a valid password include Uppercase, lowercase, number and special character and at least 8 characters"),
    rePassword:z.string("must be the same as password").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Must be the same password as above"),
    dateOfBirth:z.string("must be a valid date")  .refine((date) => {
      const today = new Date();
      const birthDate = new Date(date);
      return birthDate < today;
    })  ,
    gender:z.enum(['male','female'])
   }).refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  })



export default function Register() {




const [isshown,setisShown]=useState(false)

    const  {handleSubmit,register,formState,watch}= useForm(
      {resolver:zodResolver(schema),
        defaultValues:{
    name:'',
    email:'',
    password:'',
    rePassword:'',
    dateOfBirth:'',
    gender:'',
  },
  mode:'onntouch',
  }
    )


    const[Error,setError]=useState(null) 
    const[Confrim,setConfirm]=useState(null)
    const router =useNavigate()
    
  function ChangeEye(){
    setisShown(!isshown)

  }
  


    async function sendTheDataToApi(data){
      console.log(data)

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, data);
        const ConfirmMessage = response.data.message;
        setConfirm(ConfirmMessage);
        setTimeout(() => {
          router("/login");
        }, 2000);
      } catch (error) {
        const errorMessage = error?.response?.data?.error;
        setError(errorMessage);
      }
    }




  return (
    
    <div className=' min-h-screen flex justify-center items-center '>
    <div className="card bg-white w-xl p-8 rounded-2xl shadow-2xl">
      <div className='text-center'>
      <h2 className=' text-blue-600  text-center font-bold text-2xl'>Create Account</h2>
      <p className=' font-semibold text-zinc-600'>Join the coummunty and stat sharing </p>
      </div>
      <form onSubmit={handleSubmit(sendTheDataToApi)}>
      {/* Username */}
      <div onSubmit={handleSubmit(sendTheDataToApi)} className='my-4'>
        <label>UserName</label>
        <input {...register('name')}  type="text" className='input' placeholder='UserName'/>
        <ErrorMessege title={formState.errors.name?.message || ''} />
      </div> 
      {/* email */}
      <div className='my-4'>
        <label>email</label>
        <input {...register('email')} type="text" className='input' placeholder='email'/>
        <ErrorMessege title={formState.errors.email?.message || ''} />
      </div>
      {/* Password */}
      <div className='my-4 relative '>
        <label>Password</label>
        <input {...register('password')} type={isshown ? 'text':'password'} className='input relative' placeholder='Password'/>
        {isshown ? <Eye id='opened' onClick={ChangeEye} className=' absolute top-0 right-0 translate-y-10 -translate-x-2 cursor-pointer' size="30" color=" gray"/>
        :        <EyeSlash id='closed' onClick={ChangeEye} className='absolute top-0 right-0 translate-y-10 -translate-x-2 cursor-pointer  ' size="30" color="gray"/>
      }<ErrorMessege title={formState.errors.password?.message || ''}  />
      </div>
      {/* Confirm Password */}
      <div className='my-4'>
        <label>Confirm Password</label>
        <input {...register('rePassword')} type="text" className='input' placeholder='Confirm Password'/>
        <ErrorMessege title={formState.errors.rePassword?.message || ''} />
      </div>
      {/* Birth Date */}
      <div className='my-4'>
        <label>Birth Date</label>
        <input {...register('dateOfBirth')} type="date" className='input' placeholder='Birth Date'/>
        <ErrorMessege title={formState.errors.dateOfBirth?.message || ''} />
      </div>
      {/* gender */}
<div>
  <h3 className="text-xl font-semibold mb-3">Gender</h3>

  <div className="flex items-center gap-8">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
      {...register('gender')}
        type="radio"
        name="gender"
        value="male"
        className="w-4 h-4 accent-blue-600"
      />
      <span className="text-lg">Male</span>
    </label>
      <ErrorMessege title={formState.errors.gender?.message || ''} />
    <label className="flex  items-center gap-2 cursor-pointer">
      <input
      {...register('gender')}
        type="radio"
        name="gender"
        value="female"
        className="w-4 h-4 accent-blue-600"
      />
      <span className="text-lg">Female</span>
    </label>
      <ErrorMessege title={formState.errors.gender?.message || ''} />
  </div>
</div>
<button className=' w-full bg-blue-900 text-xl text-white rounded-3xl cursor-pointer'>submit</button>
<p>if you have an account <a href="/login" className=' text-blue-600 my-3'>Login</a></p>
<ErrorMessege title={Error || ''} />
<ErrorMessege title={Confrim || ''} />
</form>


    </div>
    </div>
  )
}
