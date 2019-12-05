const mongoose = require('mongoose')
const { Schema } = mongoose
const { hash } = require('../helpers/bcrypt')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address.'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address.'],
        unique: true,
        validate: {
            validator: function (value) {
                return User.findOne({ email: value })
                    .then(user => {
                        if (user) return false
                    })
            }, message: props => `Email already registered`
        }
    },
    password: {
        type: String,
        required: [true, 'Please enter your password.']
    },
    isGoogle: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        required: [true, 'Please set your gender.']
    },
    image: {
        type: String,
        required: [true, 'Please upload your image.']
    },
    profileDescription: String,
    likers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

userSchema.pre('save', function (next) {
    if (this.isGoogle == false) {
        this.password = hash(this.password)
    } else {
        this.password = hash(process.env.PASSWORD_USER)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User