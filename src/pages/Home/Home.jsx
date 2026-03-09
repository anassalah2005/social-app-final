import React from 'react' 
import { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContextProvider'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import CardStyle from '../../components/CardStyle/CardStyle'
import Loading from '../../components/Loading/Loading'
import { useQuery } from '@tanstack/react-query'
import CreatePostDesign from '../../components/createPostDesign/CreatePostDesign'
export default function Home()

{
const {token} = useContext(AuthContext)
// const [posts,setPosts] = useState([])
// const [loading,setLoading] = useState(true)

async function getPosts() {

     return axios.get(`${import.meta.env.VITE_API_URL}/posts`,{
    headers:{
        token: token 
    }
})
}

const {data ,isLoading , isError ,isSuccess, refetch} = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
})
console.log(data)
console.log(isLoading , isError ,isSuccess)
        if(isLoading){
            return <Loading />
        }

  return (
    <div className='w-full'>
       
        <CreatePostDesign  /> 
      
      {data?.data.data.posts?.map((post) => (
  <CardStyle key={post.id} post={post} />
))}
    </div>
  )
}
