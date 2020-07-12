import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({ match, post: { post, loadingPost }, getPost }) => {
    useEffect(() => {
        getPost(match.params.id);
    }, [getPost, match.params.id]);

    return loadingPost || post === null ? <Spinner /> : (
        <Fragment>
            <Link to="/posts" className="btn">Back To Posts</Link>
            <PostItem post={post} showActions={false} />
            <CommentForm postId={post._id} />
            <div className="comments">
                {post.comments?.length > 0 
                    ?  post.comments.map(c => (<CommentItem key={c._id} comment={c} postId={post._id} />))
                    : "No comments found..."
                }
            </div>
        </Fragment>
    );
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
    getPost: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getPost })(Post);
