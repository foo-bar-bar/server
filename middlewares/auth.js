const { decodeToken } = require('../helpers/jwt')
const User = require('../models/user')
const Profile = require('../models/profile')

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

const authorization = (req, res, next) => {
    console.log(req.body);
    let { id } = req.params
    Profile.findOne({ _id: id, userId: req.loggedUser.id })
        .then(profile => {
            if (profile) {
                next()
            }
            else {
                next({
                    status: 400,
                    message: `You're not authorize to perform this action`
                })
            }
        })
        .catch(err => {
            next({ status: 403, message: err })
        })
}



module.exports = { authentication, authorization }
