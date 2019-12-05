const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SALT, { expiresIn: '24h' })
}

const decodeToken = (token) => {
    return jwt.verify(token, process.env.SALT)
}

module.exports = {
    generateToken,
    decodeToken
}