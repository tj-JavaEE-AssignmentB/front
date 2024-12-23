import request from '../utils/request'

export function getCategories(){
  return request({
    method: 'GET',
    url: '/categories',
  })
}

export function getRecentPosts(){
  return request({
    method: 'GET',
    url: '/HomeView/getPosts',
  })
}

export function getPostsByCategory(categoryId){
  return request({
    method: 'GET',
    url: `/category/${categoryId}`,
  })
}

export function getPostByTitle(title){
  return request({
    method: 'GET',
    url: `/search/${title}`,
  })
}

export function createPost(post){
  return request({
    method: 'POST',
    url: '/posts',
    data: post,
  })
}

export const searchPosts = (keyword) => {
  return request({
    method: 'GET',
    url: '/posts/search',
    params: {
      keyword: keyword
    }
  })
}

export const getPostDetails = (postId)=>{
  return request({
    method: 'GET',
    url: `/posts/${postId}`,
  })
}


export const likePost = (postId)=>{
  return request({
    method: 'POST',
    url: `/posts/${postId}/like`,
  })
}

export const reportPost = (postId)=>{
  return request({
    method: 'POST',
    url: `/posts/${postId}/report`,
  })
}

export const createComment = (newComment)=>{
  return request({
    method: 'POST',
    url: `/posts/${newComment.postId}/makecomment`,
    data: newComment
    
  })
}

export const getComments = (postId)=>{
  return request({
    method: 'GET',
    url: `/api/posts/${postId}/comments`,
  })
}
