import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, CLEAR_PROFILE, PROFILE_ERROR, LOGOUT } from './types';

export const getCurrentProfile = () => async dispatch => {

    try {
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

export const createProfile = (formData, history, edit = false) => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    };
    const body = JSON.stringify(formData);

    try {
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
    const config = {
        headers: { 'Content-Type': 'application/json' }
    };
    const body = JSON.stringify(formData);

    try {
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
    const config = {
        headers: { 'Content-Type': 'application/json' }
    };
    const body = JSON.stringify(formData);

    try {
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