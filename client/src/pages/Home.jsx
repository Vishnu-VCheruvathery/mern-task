import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import PostCard from '../components/Card'
import axios from 'axios'
import { Fab } from '@mui/material'
import { Add } from '@mui/icons-material'



const Home = () => {
   const [isOpen, setIsOpen] = useState(false)
   const [posts, setPosts] = useState([])
   const getPosts = async() => {
    try {
      const response = await axios.get('http://localhost:3000/posts')
      setPosts(response.data)
    } catch (error) {
      console.log(error)
    }
   }

   useEffect(() => {
     getPosts()
   }, [posts])

  return (
    <>
        
      
      
    
   
      <div style={{display: 'flex', 
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
      }}>

      {posts.map((post) => (
        <PostCard post={post}/>
      ))}
     
      <Fab 
           sx={{
            backgroundColor: '#2374f7',
            color: 'white',
            position: 'fixed',
            right: {xs: '45%',lg: '50px'},
            bottom: '30px',
            ":hover":{
               color: 'black'
            }
           }}
           onClick={() => setIsOpen(true)}
           aria-label="add">
           <Add />
          </Fab>
          <Post open={isOpen} onClose={() => setIsOpen(false)}/>
      </div>
      
    </>
   
  )
}

export default Home
