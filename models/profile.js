const mongoose = require('mongoose')
const { Schema } = mongoose

const profileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        required: [true, 'Please upload your profile picture.']
    },
    age: {
        type: String
    },
    feminine: {
        type: String
    },
    masculine: {
        type: String
    },
    multicultural: {
        type: String
    },
    lovers: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        value: { type: Number }
    }]
}, { timestamps: true })


const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile