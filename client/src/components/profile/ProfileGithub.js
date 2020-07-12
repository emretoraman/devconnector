import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRepos } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const ProfileGithub = ({ profile: { repos, loadingRepos }, username, getRepos }) => {
    useEffect(() => {
        getRepos(username);
    }, [getRepos, username]);

    return (
        <div className="profile-github">
            <h2 className="text-primary my-1">
                <i className="fab fa-github"></i> Github Repos
            </h2>
            {loadingRepos || repos === null ? <Spinner /> :
                (repos.map(repo => (
                    <div key={repo.id} className="repo bg-white p-1 my-1">
                        <div>
                            <h4><a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a></h4>
                            <p>{repo.description}</p>
                        </div>
                        <div>
                            <ul>
                                <li className="badge badge-primary">Stars: {repo.stargazers_count}</li>
                                <li className="badge badge-dark">Watchers: {repo.watchers_count}</li>
                                <li className="badge badge-light">Forks: {repo.forks_count}</li>
                            </ul>
                        </div>
                    </div>
                )))
            }
        </div>
    );
};

ProfileGithub.propTypes = {
    profile: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    getRepos: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getRepos })(ProfileGithub);
