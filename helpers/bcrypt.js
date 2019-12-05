const bcrypt = require('bcrypt')

const hash = (password) => {
    var salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

const compare = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    hash,
    compare
}