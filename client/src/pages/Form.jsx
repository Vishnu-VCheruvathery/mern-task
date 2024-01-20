import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { CloudUpload } from '@mui/icons-material';
import React, { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getToken } from '../features/userSlice'
import styled from '@emotion/styled'

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

const Form = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [email, setEmail] = useState('')
   const [newEmail, setNewEmail] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [image, setImage] = useState('')
   const [loggedUser, setLoggedUser] = useState('')
   const [loggedPassword, setLoggedPassword] = useState('')
   const [isOpen, setIsOpen] = useState(false)

   const Register = async() => {
    try {
     await axios.post('http://localhost:3000/users/register', 
      {username:username, 
        password:password,
       email: email,
       image: image
      }
      )
      setUsername('')
      setPassword('')
      setEmail('')
      setImage('')
      toast.success('Successfully Registered!')
     
    } catch (error) {
      console.log(error)
    }  
   
    
   }


   const Login = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        username: loggedUser,
        password: loggedPassword,
      });
  
      if (response.status === 200) {
        const token = await response.data.token;
        if (token) {
          // Token is valid, store it
          localStorage.setItem('authToken', token);
          dispatch(getToken())
          navigate("/")
          toast.success(`Welcome ${loggedUser}`);
        } else {
          // Handle invalid token
          toast.error(response.data.error);
        }
      } else {
        // Handle error response
        toast.error(response.data.error);
      }
      
      
    }catch(err){
      console.log(err)
    }
  };

   const forgotPassword = async() => {
     try {
        await axios.put('http://localhost:3000/users/forgot', {email: newEmail, password: newPassword})
        toast.success('Password updated')
     } catch (error) {
      console.log(error)
     }
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


  return (
    <Stack 
    direction={{xs:'column' ,lg: 'row', md: 'row'}} 
    spacing={{xs: 2, lg: 5}}
   sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: {xs: 5, lg: 15}
   }}
    >
      <Box sx={{
        backgroundColor: 'white',
        width: 300,
        display: 'flex',
        padding: '10px',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        flexDirection: 'column',
        borderRadius: '0.5em',
        gap: 3,
        boxShadow: ' 0 0 10px 5px rgba(0, 0, 0, 0.5)'
      }}>
        <Typography variant='h5' sx={{fontWeight: 100}}>Login</Typography>
          <TextField
          required
          id="outlined-required"
          label="Username"
          value={loggedUser}
          onChange={(e) => setLoggedUser(e.target.value)}
          autoComplete='off'
        />
           <TextField
          required
          id="outlined-required"
          label="Password"
          type='password'
          value={loggedPassword}
          onChange={(e) => setLoggedPassword(e.target.value)}
          autoComplete='off'
        />
          <Button variant="contained" sx={{
            backgroundColor:"#2374f7"
          }}
          onClick={Login}
          >
            LOGIN
          </Button>
          <Typography 
          style={{textDecoration: 'underline', cursor: 'pointer'}} 
          variant='body2'
          onClick={() => setIsOpen(!isOpen)}
          >Forgot your password?</Typography>
          <div style={{display: isOpen ? 'flex' : 'none', 
          flexDirection: 'column' ,
          alignItems: 'center'}}>
          <TextField

              required
              id="outlined-required"
              label="Enter Email"
              type='text'
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              autoComplete='off'
              />
               <TextField

                required
                id="outlined-required"
                label="Enter Password"
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete='off'
                />
              <Button
              onClick={forgotPassword}
              >OK</Button>
          </div>
        
      </Box>
      <Box sx={{
        backgroundColor: 'white',
        width: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        flexDirection: 'column',
        borderRadius: '0.5em',
        gap: 3,
        padding: '10px',
        boxShadow: ' 0 0 10px 5px rgba(0, 0, 0, 0.5)'
      }}>
        <Typography variant='h5' sx={{fontWeight: 100}}>Register</Typography>
          <TextField
          required
          id="outlined-required"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete='off'
        />
           <TextField
          required
          id="outlined-required"
          label="Password"
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='off'
        />

          <TextField
          required
          id="outlined-required"
          label="Email"
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete='off'
        />

          <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUpload />}
                >
                  Upload file
                  <VisuallyHiddenInput 
                type="file"   
                accept='.jpeg, .png, .jpg'
                onChange={handleImage}
                />
              </Button>
          <Button variant="contained" sx={{
            backgroundColor:"#2374f7"
          }}
          onClick={Register}
          >
            REGISTER
          </Button>
      </Box>
    </Stack>
  )
}

export default Form
