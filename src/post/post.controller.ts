import { createPost, getPostById, removePostById, getPosts } from './post.service'
import { isEmpty } from '../util/validate'
import jwt_decode from 'jwt-decode'
import { UserData, PostData, Req, Res } from '../types'
import { getUserById } from '../user/user.service'
// import { v2 as cloudinary } from 'cloudinary'

export const getAllPosts = async (req: Req, res: Res) => {
    try{
        const posts : any = await getPosts();
        return res.status(200).json(posts);
    }catch(error){
        return res.status(500).json(error)
    }
};

export const createNewPost = async (req: Req, res: Res) => {
    const { title, url, imageUrl } = req.body
    const token = req.get('Authorization')
    const userInfo: UserData = jwt_decode(token!)
    const emptyErrors = isEmpty({ title, url, imageUrl })

    if (Object.keys(emptyErrors).length > 0)
        return res.status(400).json(emptyErrors)

    const userFromRequest: any = await getUserById(userInfo.userId)

    if (!userFromRequest) return res.status(401).json({ error: 'Unauthorized' })

    try {
        const createdPost: PostData = await createPost({
            title,
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

    const userFromRequest: any = await getUserById(userInfo.userId)

    if (!userFromRequest) return res.status(401).json({ error: 'Unauthorized' })

    const post: any = await getPostById(id)
    if (!post) return res.status(404).json({ error: 'Not Found' })

    try {
        const deletedPost: any = await removePostById(id)
        return res.status(200).json(deletedPost)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// const uploadImage = async (image : File) => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(image, (err: Error, url : string) => {
//             if (err) return reject(err)
//             return resolve(url)
//         })
//     })
// }
