import React, { useState, useRef } from 'react';
import { Typography, TextField, Button, Avatar, Divider, Grid, IconButton } from '@material-ui/core/';
import { useDispatch } from 'react-redux';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

import { commentPost } from '../../actions/posts';
import useStyles from './styles';

const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [comment, setComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // Parent comment ID
  const [expandedComments, setExpandedComments] = useState([]);
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments || []); // Initialize comments state with post comments
  const classes = useStyles();
  const commentsRef = useRef();

  const handleComment = async (parentCommentId = null, commentText, userName) => {
   
    const newCommentText = `${userName}: ${commentText}`;

  
    const newComments = await dispatch(commentPost({ parentCommentId, newCommentText }, post._id));
   
    setComment('');

   
    setComments(newComments);

  
    commentsRef.current.scrollIntoView({ behavior: 'smooth' });

 
    setReplyingTo(null);
  };

  const toggleReplies = (commentId) => {
    setExpandedComments((prevExpanded) => {
      if (prevExpanded.includes(commentId)) {
        return prevExpanded.filter((id) => id !== commentId);
      } else {
        return [...prevExpanded, commentId];
      }
    });
  };

  const renderComments = (comments, level = 0) => {
    return (
      <Grid container spacing={2} direction="column">
        {comments.map((comment) => (
          <Grid item key={comment._id}>
            <div className={classes.commentContainer} style={{ paddingLeft: `${level * 20}px`, borderLeft: `2px solid ${level % 2 === 0 ? '#f0f0f0' : '#e0e0e0'}`, padding: '10px', marginBottom: '5px', background: level % 2 === 0 ? '#f9f9f9' : '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt={comment.user} src={comment.avatar} className={classes.avatar} />
                <Typography variant="subtitle1" style={{ marginLeft: '10px' }}>
                 <strong>{comment.text.split(':')[0]}</strong>: {comment.text.split(':').slice(1).join(':')}
                </Typography>
              </div>
              <div className={classes.replyContainer}>
                <IconButton onClick={() => { setReplyingTo(comment._id); setReplyText(''); }} className={classes.replyButton} style={{ color: '#3f51b5' }}>Reply</IconButton>
                {replyingTo === comment._id && (
                  <div>
                    <TextField fullWidth rows={2} variant="outlined" label="Reply" multiline value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                    <Button onClick={() => handleComment(comment._id, replyText, user?.result?.name)} className={classes.postReplyButton} style={{ background: '#3f51b5', color: '#fff' }}>Post Reply</Button>
                  </div>
                )}
                {comment.children.length > 0 && (
                  <IconButton onClick={() => toggleReplies(comment._id)} style={{ color: '#3f51b5' }}>
                    {expandedComments.includes(comment._id) ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </div>
              {comment.children.length > 0 && expandedComments.includes(comment._id) && (
                <div className={classes.nestedComments}>
                  {renderComments(comment.children, level + 1)} {/* Render nested comments */}
                </div>
              )}
            </div>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.commentsOuterContainer}>
        <Typography variant="h6" className={classes.commentsTitle} style={{ color: '#3f51b5' }}>Comments</Typography>
        <Divider className={classes.divider} />
        {comments.length === 0 ? (
          <Typography variant="body2" color="textSecondary">No comments yet</Typography>
        ) : (
          renderComments(comments)
        )}
        <div ref={commentsRef} />
      </div>
      <div className={classes.commentInputContainer}>
        <Typography variant="h6" style={{ color: '#3f51b5' }}>Write a comment</Typography>
        <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
        <Button fullWidth disabled={!comment.length} color="primary" variant="contained" onClick={() => handleComment(null, comment, user?.result?.name)} className={classes.commentButton} style={{ background: '#3f51b5', color: '#fff' }}>
          Comment
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
