import React, { useState } from 'react'
import {Avatar, Button, Menu, MenuItem} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/userSlice';
import {jwtDecode} from 'jwt-decode'

const Navbar = () => {
    let username = null
    let profile = null
    const token = useSelector((state) => state.user.token)
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

   if(token){
    username = jwtDecode(token).username
    profile = jwtDecode(token).Avatar?.url
   }

  return (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#32b1e3',
        color: '#fff'
    }}>
      <div>
      <Link to='/' style={{textDecoration: 'none', color: 'white'}}>
      <h1>SociLink</h1>
      </Link>
      </div>
      {token ? (
        <div  style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Avatar alt="Remy Sharp" src={profile} sx={{marginRight: '5px'}}/>
        
        <h3>{username}</h3>
      
      
        <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
            padding: 0
        }}
      >
        <ArrowDropDownIcon sx={{color: 'white'}}/>
        </Button>
        <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleClose}>
        <Link style={{textDecoration: 'none', color: 'black'}} to='/forms'>
        Login/Register
        </Link>
        </MenuItem>
        <MenuItem onClick={() => dispatch(logout())}>Logout</MenuItem>
      </Menu>
      </div>
      ) : (
        <div>
              <Link  style={{textDecoration: 'none', color: 'white'}} to='/forms'>
              <h3>Sign-in OR Log-in</h3>
              </Link>
            
        </div>
      )}
     
    </div>
  )
}

export default Navbar
