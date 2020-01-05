import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createExperience } from '../../actions/profile';

const CreateExperience = ({ createExperience, history }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: ''
    });

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: (e.target.type === 'checkbox' ? e.target.checked : e.target.value) });;

    const onSubmit = e => {
        e.preventDefault();
        createExperience(formData, history);
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
                Add An Experience
            </h1>
            <p className="lead">
                <i className="fas fa-code-branch"></i> Add any developer/programming positions that you have had in the past
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <input type="text" placeholder="* Job Title" name="title" required value={title} onChange={onChange} />
                </div>
                <div className="form-group">
                    <input type="text" placeholder="* Company" name="company" required value={company} onChange={onChange} />
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Location" name="location" value={location} onChange={onChange} />
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input type="date" name="from" value={from} onChange={onChange} />
                </div>
                <div className="form-group">
                    <p><input type="checkbox" id="current" name="current" checked={current} onChange={onChange} /> <label htmlFor="current">Current Job</label></p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input type="date" name="to" value={to} onChange={onChange} disabled={current} />
                </div>
                <div className="form-group">
                    <textarea name="description" cols="30" rows="5" placeholder="Job Description" value={description} onChange={onChange}></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link to="/dashboard" className="btn btn-light my-1">Go Back</Link>
            </form>
        </Fragment>
    );
};

CreateExperience.propTypes = {
    createExperience: PropTypes.func.isRequired
};

export default connect(null, { createExperience })(withRouter(CreateExperience));
