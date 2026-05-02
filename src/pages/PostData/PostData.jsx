import axios from 'axios'
import React, { useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContextProvider'
import CardStyle from '../../components/CardStyle/CardStyle'
import Loading from '../../components/Loading/Loading'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@heroui/react'

export default function PostData() {
  const { id } = useParams()
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  async function postdata (){
    return axios.get(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
        headers: { token },
      })
  }
  
  const {data , isLoading} = useQuery({
    queryKey: ['postdata', id],
    queryFn: postdata,
  })

  async function Comments (){
    return axios.get(`${import.meta.env.VITE_API_URL}/posts/${id}/comments`, {
        headers: { token },
      })
  }
  
  const {data : commentsData , isLoading : commentLoading} = useQuery({
    queryKey: ['commentdata', id],
    queryFn: Comments,
  })

  if(isLoading || commentLoading){
    return <Loading />
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 pb-20">
      <div className="flex items-center gap-4 px-4">
        <Button 
          variant="light" 
          isIconOnly 
          radius="full"
          className="hover:bg-white/10"
          onPress={() => navigate(-1)}
        >
          <svg fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
        <h2 className="text-2xl font-black tracking-tight text-foreground">Post Conversation</h2>
      </div>

      <CardStyle 
        post={data?.data?.post || data?.data?.data?.post} 
        comments={commentsData?.data?.comments || commentsData?.data?.data?.comments} 
      />
    </div>
  )
}