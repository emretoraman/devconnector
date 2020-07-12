import axios from 'axios';
import { GET_POSTS, GET_POST, UPDATE_LIKES, POST_ERROR, DELETE_POST, CREATE_POST, CREATE_COMMENT, DELETE_COMMENT, CLEAR_POSTS, CLEAR_POST } from '../actions/types';
import { setAlert } from './alert';

export const getPosts = () => async dispatch => {
    try {
        dispatch({ type: CLEAR_POSTS });

        const res = await axios.get('/api/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const getPost = id => async dispatch => {
    try {
        dispatch({ type: CLEAR_POST });

        const res = await axios.get(`/api/posts/${id}`);

        dispatch({
            type: GET_POST,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const createPost = formData => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    };
    const body = JSON.stringify(formData);

    try {
        const res = await axios.post('/api/posts/', body, config);

        dispatch({
            type: CREATE_POST,
            payload: res.data
        });

        dispatch(setAlert('Post created', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`/api/posts/${id}`);

        dispatch({
            type: DELETE_POST,
            payload: id
        });

        dispatch(setAlert('Post deleted', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const createLike = id => async dispatch => {
    try {
        const res = await axios.post(`/api/posts/${id}/like`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { _id: id, likes: res.data }
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const deleteLike = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/${id}/like`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { _id: id, likes: res.data }
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const createComment = (postId, formData) => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    };
    const body = JSON.stringify(formData);

    try {
        const res = await axios.post(`/api/posts/${postId}/comment`, body, config);

        dispatch({
            type: CREATE_COMMENT,
            payload: res.data
        });

        dispatch(setAlert('Comment created', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const deleteComment = (postId, id) => async dispatch => {
    try {
        await axios.delete(`/api/posts/${postId}/comment/${id}`);

        dispatch({
            type: DELETE_COMMENT,
            payload: id
        });

        dispatch(setAlert('Comment deleted', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}