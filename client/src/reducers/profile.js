import { CLEAR_PROFILE, GET_PROFILE, CLEAR_PROFILES, GET_PROFILES, CLEAR_REPOS, GET_REPOS, PROFILE_ERROR } from '../actions/types';

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loadingProfile: true,
    loadingProfiles: true,
    loadingRepos: true,
    error: {}
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                loadingProfile: true,
                error: {}
            };
        case GET_PROFILE: 
            return {
                ...state,
                profile: payload,
                loadingProfile: false
            };
        case CLEAR_PROFILES:
            return {
                ...state,
                profiles: [],
                loadingProfiles: true,
                error: {}
            };
        case GET_PROFILES: 
            return {
                ...state,
                profiles: payload,
                loadingProfiles: false
            };
        case CLEAR_REPOS:
            return {
                ...state,
                repos: [],
                loadingRepos: true,
                error: {}
            };
        case GET_REPOS:
            return {
                ...state,
                repos: payload,
                loadingRepos: false
            };
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loadingProfile: false,
                loadingProfiles: false,
                loadingRepos: false
            };
        default:
            return state;
    }
};
