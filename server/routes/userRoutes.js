import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import cloudinary from '../cloudinary/cloudinary.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js'
const router = express.Router()

const {SECRET_KEY} = process.env

router.post('/register', async(req,res) => {
    const {username, email, password, image} = req.body
    try {
        const user = await userModel.findOne({email})
        if(user){
            return res.json({message: "user already exists"})
        }
        const result = await cloudinary.uploader.upload(image, {
            folder: 'users',
         })
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new userModel({
            username: username,
            password: hashedPassword,
            email: email,
            Avatar: {
                public_id: result.public_id,
                url: result.secure_url
            }
        })

        await newUser.save()
        
       res.json({message: 'User Registered'})
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userModel.findOne({ username });
  
      if (!user) {
        return res.json({
          error: 'No User found'
        });
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (match) {
        const token = jwt.sign({ id: user._id, username: username, Avatar: user.Avatar }, SECRET_KEY);
  
        console.log(token);
        res.json({ token});
      } else {
        // Passwords don't match, don't generate a token
        res.json({
          error: "Passwords don't match"
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.put('/forgot', async(req,res) => {
    const {email, password} = req.body
    try {
      const user = await userModel.findOne({email})

      console.log('User Password:', user.password);
      console.log('Entered Password:', password);

      if (!user) {
        return res.json({
          error: 'No User found'
        });
      }
     

      const hashedPassword = await bcrypt.hash(password, 10)

      const updateUser = await userModel.findByIdAndUpdate(user._id, {
        password: hashedPassword
      })

      res.json(updateUser)
    } catch (error) {
      console.log(error)
    }
  })

export {router as userRouter}