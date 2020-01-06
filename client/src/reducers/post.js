import { GET_POSTS, GET_POST, UPDATE_LIKES, POST_ERROR, DELETE_POST, CREATE_POST, CREATE_COMMENT, DELETE_COMMENT } from '../actions/types';

const initialState = {
    post: null,
    posts: [],
    loading: true,
    error: {}
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_POSTS: 
            return {
                ...state,
                posts: payload,
                loading: false
            };
        case GET_POST: 
            return {
                ...state,
                post: payload,
                loading: false
            };
        case CREATE_POST: 
            return {
                ...state,
                posts: [payload, ...state.posts],
                loading: false
            };
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== payload),
                loading: false
            }
        case UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map(post => (post._id === payload._id ? { ...post, likes: payload.likes } : post)),
                loading: false
            };
        case CREATE_COMMENT: 
            return {
                ...state,
                post: {...state.post, comments: payload},
                loading: false
            };
        case DELETE_COMMENT:
            return {
                ...state,
                post: {...state.post, comments: state.post.comments.filter(comment => comment._id !== payload)},
                loading: false
            }
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
};
