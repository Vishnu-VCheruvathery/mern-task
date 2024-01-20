import express from 'express'
import { postModel } from '../models/postModel.js'
import cloudinary from '../cloudinary/cloudinary.js'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const posts = await postModel
            .find({})
            .populate('poster', 'username Avatar')
            .populate('comments.commenter', 'username Avatar');

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async(req,res) => {
     const {poster, image, description, title} = req.body

    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: 'posts',
         })

        const newPost = new postModel({
           poster: poster,
           image: {
            public_id: result.public_id,
            url: result.secure_url
           },
           description: description,
           title: title
        })

       await newPost.save()
        res.json({message: 'Posted successfully!!'})
    } catch (error) {
        console.log(error)
    }
})

router.put('/edit/:postId', async(req,res) => {
    const {postId} = req.params
    const {poster, image, description, title} = req.body
    console.log(req.params)
    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: 'posts',
         })

         const updatePost = await postModel.findByIdAndUpdate(postId, {
            poster: poster,
            image: {
             public_id: result.public_id,
             url: result.secure_url
            },
            description: description,
            title: title
         })

         res.json(updatePost)
    } catch (error) {
        console.log(error)
    }
})


router.put('/like/:postId/:userId', async(req,res) => {
    const {postId, userId} = req.params
 
    
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    try {
        const response = await postModel.findByIdAndUpdate(postId, {
            $push : {likes: userId}
        })

        res.json(response)
    } catch (error) {
        console.log(error)
    }
})

router.put('/unlike/:postId/:userId', async(req,res) => {
    const {postId, userId} = req.params

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    try {
        const response = await postModel.findByIdAndUpdate(postId, {
            $pull : {likes: userId}
        })

        res.json(response)
    } catch (error) {
        console.log(error)
    }
})

router.put('/comment/:postId/:userId', async (req, res) => {
    const { postId, userId } = req.params;
    const { comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    try {
        const response = await postModel.findByIdAndUpdate(
            postId,
            {
                $addToSet: { comments: { commenter: userId, content: comment } },
            },
            { new: true } // This ensures that the updated document is returned
        );

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/delete/:id', async(req,res) => {
    const {id} = req.params
    try {
        const deletePost = await postModel.findByIdAndDelete(id)
        res.json(deletePost)
    } catch (error) {
        console.log(error)
    }
})

export {router as postRouter}