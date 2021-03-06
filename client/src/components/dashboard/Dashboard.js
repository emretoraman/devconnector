import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile, deleteProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({ auth: { user }, profile: { profile, loadingProfile }, getCurrentProfile, deleteProfile }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return (
        <Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead">
                <i className="fas fa-user" /> Welcome {user && user.name}
            </p>
            {loadingProfile
                ? (<Spinner />)
                : (
                    <Fragment>
                        {profile
                            ? (
                                <Fragment>
                                    <DashboardActions />
                                    <Experience experience={profile.experience} />
                                    <Education education={profile.education} />
                                </Fragment>
                            )
                            : (
                                <Fragment>
                                    <p>You have not yet setup a profile, please add some info</p>
                                    <Link to="/create-profile" className="btn btn-primary my-1">
                                        Create Profile
                                    </Link>
                                </Fragment>
                            )
                        }
                        <div className="my-2">
                            <button className="btn btn-danger" onClick={() => deleteProfile()}>
                                <i className="fas fa-user-minus"></i> Delete My Account
                            </button>
                        </div>
                    </Fragment>
                )
            }
        </Fragment>
    );
};

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    deleteProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteProfile })(Dashboard);
