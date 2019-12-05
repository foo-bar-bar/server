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
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })


const User = mongoose.model('User', profileSchema)

module.exports = User