const { decodeToken } = require('../helpers/jwt')
const User = require('../models/user')

const authentication = (req, res, next) => {
    try {
        req.loggedUser = decodeToken(req.headers.token)
        console.log(req.loggedUser);
        User.findOne({
            email: req.loggedUser.email
        })
            .then(user => {
                console.log(user);
                if (user) next()
                else throw new Error({ status: 401, message: 'Authentication Failed' })
            })
            .catch(next)
    }
    catch (error) {
        next(error)
    }
}



module.exports = authentication
