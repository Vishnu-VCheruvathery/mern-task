import styled from '@emotion/styled';
import { Close, CloudUpload } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import {jwtDecode} from 'jwt-decode'
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

const MODAL_STYLES = {
    position: "fixed",
    display: 'flex',
    gap: '12px',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    padding: '50px',
    zIndex: 1000,
    border: '1px solid gray',
    borderRadius: '0.5em'
}

const OVERLAY_STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

const Post = ({open, onClose}) => {
  const token = useSelector((state) => state.user.token);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    let poster = null
    if(token){
        poster = jwtDecode(token).id
    }

    const handleImage = (e) => {
        const file  =  e.target.files[0]
        setFileToBase(file)
        console.log(file)
       }
    
       const setFileToBase = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          setImage(reader.result)
        }
       }

    const Post = async() => {
        try {
            const response = await axios.post('http://localhost:3000/posts/', {
                poster,
                title,
                description,
                image
            })
            toast.success('Post Successful!') 
        } catch (error) {
            console.log(error)
        }
    }

    if(!open) return null
    return createPortal(
        <>
        <div style={OVERLAY_STYLE} />
       
        <div style={MODAL_STYLES}>
        <Button sx={{
          border: '1px solid black',
          width: '10px',
          marginBottom: '20px'
        }}
        onClick={onClose}
        >
          <Close/>
        </Button>
        <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUpload />}
                >
                  Upload Image
                  <VisuallyHiddenInput 
                type="file"   
                accept='.jpeg, .png, .jpg'
                onChange={handleImage}
                />
              </Button>
              <TextField id="outlined-basic" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Enter Title" variant="outlined" />
        
        <TextField id="outlined-basic" label="Enter Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
         variant="outlined" />
        <button onClick={Post}>POST</button>
        </div>
        </>,
    
        document.getElementById('portal')
      )
}

export default Post
