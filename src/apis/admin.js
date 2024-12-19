import { httpInstance } from '@/utils/baseapi';

export const getAuditPostInfo=async()=>{
  try{
    const response = await httpInstance({
      url: '/post/auditPostInfo',
      method: 'GET'
    })
    if(response.status===200){
      return response.data
    }
    else{
      console.log('未知错误')
    }
  }catch(error){
    console.log(error)
  }
}

export const postPass=async(postId)=>{
  try{
    console.log(postId)
    const response = await httpInstance({
      url: '/post/postPass',
      method: 'POST',
      data:{
        postId:postId
      }
    })
    if(response.status!==200){
      console.log('未知错误')
    }
  }catch(error){
    console.log(error)
  }
}

export const postRefund=async(postId)=>{
  try{
    const response = await httpInstance({
      url: '/post/postRefund',
      method: 'POST',
      data:{
        postId:postId
      }
    })
    if(response.status!==200){
      console.log('未知错误')
    }
  }catch(error){
    console.log(error)
  }
}