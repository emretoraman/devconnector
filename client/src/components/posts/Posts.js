import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPosts } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';

const Posts = ({ post: { posts, loadingPosts }, getPosts }) => {
    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>
            <p className="lead"><i className="fas fa-user"></i> Welcome to the community!</p>
            {loadingPosts
                ? (<Spinner />)
                : (<Fragment>
                    <PostForm />
                    <div className="posts">
                        {posts?.length > 0
                            ? posts.map(p => (<PostItem key={p._id} post={p} />))
                            : "No posts found..."
                        }
                    </div>
                </Fragment>)
            }
        </Fragment>
    );
};

Posts.propTypes = {
    post: PropTypes.object.isRequired,
    getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getPosts })(Posts);
