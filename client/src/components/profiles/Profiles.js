import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProfiles } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';

const Profiles = ({ profile: { profiles, loadingProfiles }, getProfiles }) => {
    useEffect(() => {
        getProfiles();
    }, [getProfiles]);

    return (<Fragment>
        <h1 className="large text-primary">Developers</h1>
        <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse and connect with developers
        </p>
        {loadingProfiles ? <Spinner /> : (
            <div className="profiles">
                {profiles?.length > 0
                    ? profiles.map(p => (<ProfileItem key={p._id} profile={p} />))
                    : "No profiles found..."
                }
            </div>
        )}

    </Fragment>);
};

Profiles.propTypes = {
    profile: PropTypes.object.isRequired,
    getProfiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
