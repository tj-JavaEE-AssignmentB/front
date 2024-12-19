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