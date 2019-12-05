const User = require('../models/user'),
    { compare } = require('../helpers/bcrypt'),
    { generateToken } = require('../helpers/jwt'),
    { OAuth2Client } = require('google-auth-library');

class UserController {

    static register(req, res, next) {
        let { name, email, password } = req.body
        User.create({ name, email, password })
            .then(newUser => {
                res.status(201).json(newUser)
            })
            .catch(next)
        // }
    }

    static login(req, res, next) {
        let { email, password } = req.body
        User.findOne({
            email: email
        })
            .then(user => {
                if (!user) {
                    next({ status: 403, message: 'Invalid email or password.' })
                } else {
                    let authPass = compare(password, user.password)
                    if (authPass) {
                        let name = user.name,
                            email = user.email,
                            _id = user._id;

                        const token = generateToken({
                            name: name,
                            email: email,
                            id: _id
                        })
                        res.status(200).json({ token, name, email })
                    } else {
                        next({ status: 403, message: 'Invalid email or password.' })
                    }

                }
            })
            .catch(next)
    }

}

module.exports = UserController