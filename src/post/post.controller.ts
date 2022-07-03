import { createPost, getPostById, removePostById } from './post.service'
import { isEmpty } from '../util/validate'
import jwt_decode from 'jwt-decode'
import { UserData, PostData, Req, Res } from '../types'
import { getUserById } from '../user/user.service'

export const createNewPost = async (req: Req, res: Res) => {
    const { title, text, url, imageUrl } = req.body
    const token = req.get('Authorization')
    const userInfo: UserData = jwt_decode(token!)
    const emptyErrors = isEmpty({ title, text, url, imageUrl })

    if (Object.keys(emptyErrors).length > 0)
        return res.status(400).json(emptyErrors)

    const userFromRequest = await getUserById(userInfo.userId)

    if (!userFromRequest) return res.status(401).json({ error: 'Unauthorized' })

    try {
        const createdPost: PostData = await createPost({
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

export const removePost = async (req: Req, res: Res) => {
    const { id } = req.params
    const token = req.get('Authorization')
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const userInfo: UserData = jwt_decode(token)

    const userFromRequest = await getUserById(userInfo.userId)

    if (!userFromRequest) return res.status(401).json({ error: 'Unauthorized' })

    const post: PostData = await getPostById(id)
    if (!post) return res.status(404).json({ error: 'Not Found' })

    try {
        const deletedPost: PostData = await removePostById(id)
        return res.status(200).json(deletedPost)
    } catch (error) {
        return res.status(500).json(error)
    }
}
