const toUpdate = (fields, data) => {
    let dataChanged = {}

    for (let key in data) {
        fields.forEach(el => {
            if (el === key) {
                dataChanged[key] = data[key]
            }
        })
    }

    return dataChanged
}

module.exports = toUpdate