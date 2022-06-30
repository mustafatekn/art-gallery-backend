import Post from './post.model'
import { PostData } from '../types'

export const createPost = async ({
    title,
    text,
    url,
    imageUrl,
    user,
}: PostData) => {
    const post = new Post({
        title,
        text,
        url,
        imageUrl,
        user,
    })
    return await post.save()
}

export const removePostById = async (id: string) => {
    return await Post.findByIdAndDelete(id)
}

export const getPostById = async (id: string) => {
    return await Post.findById(id)
}
