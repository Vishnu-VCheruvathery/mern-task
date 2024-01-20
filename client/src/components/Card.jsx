import React, { useEffect, useState } from 'react'
import {Button, IconButton, Card, CardActions, CardContent, CardMedia, Collapse, Typography, styled, Avatar, TextField, Tooltip} from '@mui/material'
import { Favorite, AddComment, Send, Create, Delete} from '@mui/icons-material';
import {jwtDecode} from 'jwt-decode'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Update from './Update';
import toast from 'react-hot-toast';
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    '& .expand-icon': {
      transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
  }));

  const PostCard = ({post}) => {
    let userId = null
    const token = useSelector((state) => state.user.token);
    const [expanded, setExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(post.likes.includes(userId));
    const [comment, setComment] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
  
    if(token){
        userId = jwtDecode(token).id
    }
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const likePost = async ({postId, userId}) => {
        try {
            setIsLiked(true); // Set isLiked to true when the post is liked
          await axios.put(`http://localhost:3000/posts/like/${postId}/${userId}`);
         
        } catch (error) {
          console.log(error);
        }
      };
    
      const unLikePost = async ({postId, userId}) => {
        try {
            setIsLiked(false); // Set isLiked to false when the post is unliked
          await axios.put(`http://localhost:3000/posts/unlike/${postId}/${userId}`);
          
        } catch (error) {
          console.log(error);
        }
      };

      const commentPost = async({postId, userId}) => {
        try {
            await axios.put(`http://localhost:3000/posts/comment/${postId}/${userId}`, {comment});
            setIsOpen(false)
        } catch (error) {
            console.log(error)
        }
      }

      const deletePost = async({id}) => {
        try {
            await axios.delete(`http://localhost:3000/posts/delete/${id}`)
            toast.success('Post deleted')
        } catch (error) {
            console.log(error)
        }
      }

      useEffect(() => {
        // Fetch the post data, including the user's like status
        const fetchPostData = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/posts/${post._id}`);
            const updatedPost = response.data;
            setIsLiked(updatedPost.likes?.includes(userId));
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchPostData();
      }, [post._id, userId]);

  return (
    <Card sx={{  width: {xs: '400px', lg: '650px'}}}>
      <CardMedia
        sx={{height: '200px',
        width: '100%',
        objectFit: 'cover'
        }}
        image={post.image.url}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="h6" component="div">
         {post.description}
        </Typography>
        <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginTop: '20px'}}>
        <Avatar src={post.poster?.Avatar?.url}
        />
        <Typography  variant="body2" color="text.secondary">
            {post.poster.username}
        </Typography>
        </div>
      </CardContent>
      <CardActions sx={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
      <div>
      <IconButton aria-label="add to favorites" onClick={() => (isLiked ? unLikePost({postId: post._id, userId: userId}) : likePost({postId: post._id, userId: userId}))}>
          <Tooltip title='Like'>

          <Favorite sx={{ color: isLiked ? 'red' : 'inherit' }}/>
          </Tooltip>
         
        </IconButton>
        <IconButton onClick={() => setIsOpen(true)} aria-label="add to favorites">
         <Tooltip title='Add Comment'>
         <AddComment />
         </Tooltip>
         
        </IconButton>
        <IconButton onClick={() => setEditOpen(true)}>
        <Tooltip title='Edit'>
        <Create />
        </Tooltip>
         
        </IconButton>
        <IconButton onClick={() => deletePost({id: post._id})}>
        <Tooltip title='Delete'>
        <Delete />
        </Tooltip>
            
        </IconButton>
      </div>

        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <Typography variant='body2'>Comments</Typography>
            <ExpandMoreIcon className="expand-icon" />
            </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
        {post.comments?.map((comment) => (
            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
         <Avatar src={comment.commenter?.Avatar?.url}/>
         <Typography style={{fontWeight: 'bold'}} src>{comment.commenter?.username}:</Typography>
         <Typography>{comment.content}</Typography> 
        </div>
        ))}
       
        </CardContent>
      </Collapse>
      <div style={{ display: isOpen ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', padding: '10px'}}>
      <TextField value={comment} onChange={(e) => setComment(e.target.value)}
      id="outlined-basic" label="Comment" variant="outlined" />
      <IconButton onClick={() => commentPost({postId: post._id, userId: userId})}>
      <Send />
      </IconButton>
      </div>
      <Update postId={post._id} open={editOpen} onClose={() => setEditOpen(false)}/>
    </Card>
  )
}

export default PostCard
