const axios = require('axios')
const Profile = require('../models/profile')
const User = require('../models/user')

class ProfileC {

    static uploadImage(req, res, next) {
        console.log(req.file, req.loggedUser.id);
        let image = req.file.cloudStoragePublicUrl;
        let userId = req.loggedUser.id
        axios({
            methods: 'get',
            url: '',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Key ${process.env.API_KEY_CLARIFAI}`
            },
            data: {
                "inputs": [
                    {
                        "data": {
                            "image": {
                                "url": `${image}`
                            }
                        }
                    }
                ]
            }
        })
            .then(({ data }) => {
                console.log(data);
                let age = data.outputs[0].data.regions[0].data.face.age_appearance.concepts[0].name
                let feminine = data.outputs[0].data.regions[0].data.face.gender_appearance.concepts[0].value
                let masculine = data.outputs[0].data.regions[0].data.face.gender_appearance.concepts[1].value
                let multicultural = data.outputs[0].data.regions[0].data.face.multicultural_appearance.concepts[0].name

                Profile.create({
                    userId,
                    image,
                    age,
                    feminine,
                    masculine,
                    multicultural
                })
            })
            .then(profile => {
                res.status(201).json(profile)
            })
            .catch(next)
    }

    static findAll(req, res, next) {
        let target = req.query.title || ''
        console.log(req.loggedUser, target);
        User.find({ name: { $regex: target } })
            .sort({ createdAt: -1 })
            .then(profile => {
                console.log(profile)
                res.status(200).json(profile)
            })
            .catch(next)
    }

    static find(req, res, next) {
        console.log(req.loggedUser.id);
        Profile.find({
            userId: req.loggedUser.id
        })
            .sort({ createdAt: -1 })
            .populate("User", "--password")
            .then(profile => {
                console.log(profile)
                res.status(200).json(profile)
            })
            .catch(next)
    }

    static updateField(req, res, next) {
        let image = req.file.cloudStoragePublicUrl;
        let dataChange = { image: image }
        const _id = req.params.id;
        Profile.findByIdAndUpdate(
            _id,
            {
                $set: { dataChange }
            },
            {
                omitUndefined: true,
                new: true,
                runValidators: true
            })
            .then(profile => {
                res.status(201).json({ profile, message: 'success updated profile' })
            })
            .catch(err => {
                console.log(err);
            })
    }

    static delete(req, res, next) {
        const _id = req.params.id;
        Profile.findById({ _id })
            .then(profile => {
                gcsDelete(profile.image)
                return profile.findByIdAndDelete(_id)
            })
            .then(success => {
                res.status(200).json({ success, message: 'success deleting profile' })
            })
            .catch(next)
    }

    static love(req, res, next) {
        const _id = req.params.id;
        const lovers = req.loggedUser.id
        Profile.findByIdAndUpdate(
            _id,
            {
                $push: { lovers }
            },
            {
                omitUndefined: true,
                new: true,
                runValidators: true
            })
            .then(profile => {
                res.status(201).json({ profile, message: 'success updated profile' })
            })
            .catch(err => {
                console.log(err);
            })
    }



}

module.exports = ProfileC