  import axios from 'axios'
  import React, { useContext, useEffect, useState } from 'react'
  import { useParams } from 'react-router-dom'
  import { AuthContext } from '../../Context/AuthContextProvider'
  import CardStyle from '../../components/CardStyle/CardStyle'
  import Loading from '../../components/Loading/Loading'
  import { useQuery } from '@tanstack/react-query'

  export default function PostData() {
    const { id } = useParams()
    const { token } = useContext(AuthContext)


        async function postdata (){
          return axios.get(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
              headers: { token },
            })
        }
            const {data , isLoading} = useQuery({
              queryKey: ['postdata', id],
              queryFn: postdata,
            })

            console.log(data);
                  async function Comments (){
          return axios.get(`${import.meta.env.VITE_API_URL}/posts/${id}/comments?page=1&limit=10`, {
              headers: { token },
            })
        }
        
        const {data : commentsData , isLoading : commentLoading} = useQuery({
          queryKey: ['commentdata', id],
          queryFn: Comments,
        })
        console.log(commentsData);
              if(isLoading || commentLoading){
                return <Loading />
              }
    return (
      
      <div>
        <CardStyle post={data?.data.data.post} comments={commentsData?.data.data.comments} />
      </div>
    )
  }