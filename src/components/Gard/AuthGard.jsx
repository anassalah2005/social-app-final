import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContextProvider'
import { useNavigate } from 'react-router-dom'

export default function AuthGard({children})


{
const {token} = useContext(AuthContext)
let router = useNavigate();

useEffect(()=>{
if(token){
    router("/home")
}
},[token])

  return (
    <>
    {children}
    </>
  )
}
