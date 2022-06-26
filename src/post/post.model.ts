const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
