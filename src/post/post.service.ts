import Post from './post.model'

export const createPost = async ({
    title,
    text,
    url,
    imageUrl,
    user,
}: {
    title: string
    text: string
    url: string
    imageUrl: string
    user: { id: string; username: string; role: string }
}) => {
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
