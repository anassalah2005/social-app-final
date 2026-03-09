import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeSlash } from 'iconsax-reactjs'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useNavigate } from "react-router-dom";
import ErrorMessege from '../../components/ErrorMessege/ErrorMessege'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContextProvider'





  const schema = z.object({

    email:z.email( "this account doesn't exist").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "must be a valid email address"), 
    password:z.string("must be a valid password").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ , "must be a valid password include Uppercase, lowercase, number and special character and at least 8 characters"),


   })




export default function Login() {



let {setToken} =useContext(AuthContext)

const [isshown,setisShown]=useState(false)
    const  {handleSubmit,register,formState,watch}= useForm(
      {resolver:zodResolver(schema),
        defaultValues:{
    email:'',
    password:'',
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
  

    // AbI
    async function sendTheDataToApi(values){
      

    try {
      const {data} = await axios(`${import.meta.env.VITE_API_URL}/users/signin`, {
        method: "POST",
        data: values,
        

        
      })
      console.log(data)
      router("/home"),
        setToken(data.data.token)
        localStorage.setItem("token",data.data.token)
      
        
      setConfirm(data.message)
      
        
      
    } catch (error) {
      const errorMessage = error?.response?.data?.error;
      setError(errorMessage);
    }

    }




  return (
    
    <div className=' min-h-screen flex justify-center items-center '>
    <div className="card bg-white w-xl p-8 rounded-2xl shadow-2xl">
      <div className='text-center'>
      <h2 className=' text-blue-600  text-center font-bold text-2xl'>Login to your account</h2>
      <p className=' font-semibold text-zinc-600'>welcome back</p>
      </div>
      <form onSubmit={handleSubmit(sendTheDataToApi)}>

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
        <ErrorMessege title={Error || ''} />
        <ErrorMessege title={Confrim || ''} />

<button className=' w-full bg-blue-900 text-xl p-2.5 text-white rounded-3xl cursor-pointer'>login</button>
<p>if you don't have an account <a href="/register" className=' text-blue-600 my-3'>Register</a></p>   
</form>


    </div>
    </div>
  )
}
