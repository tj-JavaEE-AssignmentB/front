import request from '../utils/request'

export function fetchPostsByAuthor(userId) {
    return request.get(`/post/author/${userId}`);
}

export const fetchFavoritePostsByUser = async (userId) => {
    try {
        const response = await request.get(`/post/favorites/${userId}`);
        return response;
    } catch (error) {
        throw new Error('无法获取收藏帖子: ' + error.message);
    }
};

export const fetchCommentsByUser = async (userId) => {
    const response = await request.get(`/post/comments/${userId}`);
    return response;
};
