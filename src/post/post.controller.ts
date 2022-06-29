import { Request, Response } from 'express'
import Post from './post.model'
import { createPost, removePostById } from './post.service'
import { isEmpty } from '../util/validate'
import User from '../user/user.model'
import jwt_decode from 'jwt-decode'

type UserInfo = {
    userId: string
    username: string
    role: string
}

type Post = {
    title: string
    text: string
    url: string
    imageUrl: string
    user: {
        id: string
        username: string
        role: string
    }
}

export const createNewPost = async (req: Request, res: Response) => {
    const { title, text, url, imageUrl } = req.body
    const token = req.get('Authorization')
    const userInfo: UserInfo = jwt_decode(token!)
    const emptyErrors = isEmpty({ title, text, url, imageUrl })

    if (Object.keys(emptyErrors).length > 0)
        return res.status(400).json(emptyErrors)

    const userFromRequest = await User.findById(userInfo.userId)

    if (!userFromRequest) return res.status(401).json({ error: 'Unauthorized' })

    try {
        const createdPost: Post = await createPost({
            title,
            text,
            url,
            imageUrl,
            user: {
                id: userInfo.userId,
                username: userInfo.username,
                role: userInfo.role,
            },
        })
        return res.status(201).json(createdPost)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const removePost = async (req: Request, res: Response) => {
    const { id } = req.params
    const token = req.get('Authorization')
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const userInfo: UserInfo = jwt_decode(token)

    const userFromRequest = await User.findById(userInfo.userId)

    if (!userFromRequest) return res.status(401).json({ error: 'Unauthorized' })

    const post = await Post.findById(id)
    if (!post) return res.status(404).json({ error: 'Not Found' })

    try {
        const deletedPost = await removePostById(id)
        return res.status(200).json(deletedPost)
    } catch (error) {
        return res.status(500).json(error)
    }
}
