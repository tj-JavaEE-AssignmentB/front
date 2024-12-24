import request from '../utils/request'

export function getUserInfo(userId) {
    return request.get(`/userCenter/${userId}`);
}

export function updateUserInfo(userId, userInfo) {
    return request.put(`/userCenter/${userId}`, userInfo);
}

export function uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/upload/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
