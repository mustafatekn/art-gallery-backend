const User = require('../models/User')
const jwt_decode = require('jwt-decode')
const { isEmpty } = require('../util/validate')
const Post = require('../models/Post')

module.exports = {
    createPost: async (req, res) => {
        const { title, text, url, imageUrl } = req.body
        const token = req.get('Authorization')
        const userInfo = jwt_decode(token)
        const emptyErrors = isEmpty({ title, text, url, imageUrl })

        if (Object.keys(emptyErrors).length > 0)
            return res.status(400).json(emptyErrors)

        const userFromRequest = await User.findById(userInfo.userId)

        if (!userFromRequest)
            return res.status(401).json({ error: 'Unauthorized' })

        const post = new Post({
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

        try {
            const createdPost = await post.save()
            return res.status(201).json(createdPost)
        } catch (error) {
            return res.status(500).json(error)
        }
    },

    deletePost: async (req, res) => {
        const { id } = req.params
        const token = req.get('Authorization')
        if (!token) return res.status(401).json({ error: 'Unauthorized' })
        const userInfo = jwt_decode(token)

        const userFromRequest = await User.findById(userInfo.userId)

        if (!userFromRequest)
            return res.status(401).json({ error: 'Unauthorized' })

        const post = await Post.findById(id)
        if (!post) return res.status(404).json({ error: 'Not Found' })

        try {
            const deletedPost = await Post.findByIdAndDelete(id)
            return res.status(200).json(deletedPost)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
}
