import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, GET_PROFILES, CLEAR_PROFILE, GET_REPOS, PROFILE_ERROR, LOGOUT, CLEAR_PROFILES, CLEAR_REPOS } from './types';

export const getCurrentProfile = () => async dispatch => {
    try {
        dispatch({ type: CLEAR_PROFILE });

        const res = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({ 
            type: PROFILE_ERROR, 
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const getProfiles = () => async dispatch => {
    try {
        dispatch({ type: CLEAR_PROFILES });

        const res = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (err) {
        dispatch({ 
            type: PROFILE_ERROR, 
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const getProfile = user_id => async dispatch => {
    try {
        dispatch({ type: CLEAR_PROFILE });
        
        const res = await axios.get(`/api/profile/${user_id}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({ 
            type: PROFILE_ERROR, 
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const getRepos = username => async dispatch => {
    try {
        dispatch({ type: CLEAR_REPOS });
        
        const res = await axios.get(`/api/profile/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (err) {
        dispatch({ 
            type: PROFILE_ERROR, 
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {    
        const config = {
            headers: { 'Content-Type': 'application/json' }
        };
        const body = JSON.stringify(formData);
        const res = await axios.post('/api/profile', body, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data 
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        
        dispatch({ 
            type: PROFILE_ERROR, 
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

export const createExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        };
        const body = JSON.stringify(formData);
    
        const res = await axios.post('/api/profile/experience', body, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data 
        });

        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        
        dispatch({ 
            type: PROFILE_ERROR, 
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

export const createEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        };
        const body = JSON.stringify(formData);
    
        const res = await axios.post('/api/profile/education', body, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data 
        });

        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        
        dispatch({ 
            type: PROFILE_ERROR, 
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data 
        });

        dispatch(setAlert('Experience deleted', 'success'));
    } catch (err) {
        dispatch({ 
            type: PROFILE_ERROR, 
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data 
        });

        dispatch(setAlert('Education deleted', 'success'));
    } catch (err) {
        dispatch({ 
            type: PROFILE_ERROR, 
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

export const deleteProfile = () => async dispatch => {
    try {
        if (window.confirm('Are you sure? This can NOT be undone.')) {
            await axios.delete('/api/profile');
    
            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: LOGOUT });
    
            dispatch(setAlert('Your account has been permanently deleted', 'success'));
        }
    } catch (err) {
        dispatch({ 
            type: PROFILE_ERROR, 
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};