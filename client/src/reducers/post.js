import { GET_POSTS, GET_POST, UPDATE_LIKES, POST_ERROR, DELETE_POST, CREATE_POST, CREATE_COMMENT, DELETE_COMMENT, CLEAR_POSTS, CLEAR_POST } from '../actions/types';

const initialState = {
    post: null,
    posts: [],
    loadingPost: true,
    loadingPosts: true,
    error: {}
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case CLEAR_POSTS: 
            return {
                ...state,
                posts: [],
                loadingPosts: true
            };
        case CLEAR_POST: 
            return {
                ...state,
                post: null,
                loadingPost: true
            };
        case GET_POSTS: 
            return {
                ...state,
                posts: payload,
                loadingPosts: false
            };
        case GET_POST: 
            return {
                ...state,
                post: payload,
                loadingPost: false
            };
        case CREATE_POST: 
            return {
                ...state,
                posts: [payload, ...state.posts]
            };
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== payload)
            }
        case UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map(post => (post._id === payload._id ? { ...post, likes: payload.likes } : post))
            };
        case CREATE_COMMENT: 
            return {
                ...state,
                post: {...state.post, comments: payload}
            };
        case DELETE_COMMENT:
            return {
                ...state,
                post: {...state.post, comments: state.post.comments.filter(comment => comment._id !== payload)}
            }
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loadingPost: false,
                loadingPosts: false
            };
        default:
            return state;
    }
};
