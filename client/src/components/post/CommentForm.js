import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createComment } from '../../actions/post';

const CommentForm = ({ postId, createComment }) => {
    const [text, setText] = useState('');

    const onSubmit = e => {
        e.preventDefault();
        createComment(postId, { text });
        setText('');
    }

    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Leave A Comment</h3>
            </div>
            <form className="form my-1" onSubmit={onSubmit}>
                <textarea name="text" cols="30" rows="5" placeholder="Comment on this post" required value={text} onChange={e => setText(e.target.value)}></textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
        </div>
    );
};

CommentForm.propTypes = {
    createComment: PropTypes.func.isRequired
};

export default connect(null, { createComment })(CommentForm);
