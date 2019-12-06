const axios = require('axios')
const Profile = require('../models/profile')
const toUpdate = require('../helpers/updateField')
const User = require('../models/user')
const gcsDelete = require('../helpers/gcsdelete')

class ProfileC {

    static uploadImage(req, res, next) {
        console.log(req.file, req.loggedUser.id);
        let image = req.file.cloudStoragePublicUrl;
        let userId = req.loggedUser.id
        axios({
            method: 'post',
            url: 'https://api.clarifai.com/v2/models/c0c0ac362b03416da06ab3fa36fb58e3/outputs',
            headers: {
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

                return Profile.create({
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
        let target = req.query.name || ''
        console.log(req.loggedUser, target);
        Profile.find()
            .populate({ path: 'userId', select: "name" })
            .sort({ createdAt: -1 })
            .then(profile => {
                console.log(profile)
                res.status(200).json(profile)
            })
            .catch(next)
    }

    static findOne(req, res, next) {
        console.log(req.loggedUser.id);
        Profile.findById(req.params.id)
            .sort({ createdAt: -1 })
            .populate({ path: "userId", select: "name" })
            .then(profile => {
                console.log(profile)
                res.status(200).json(profile)
            })
            .catch(next)
    }

    static updateField(req, res, next) {
        let url = req.file.cloudStoragePublicUrl;
        const _id = req.params.id;
        console.log(url);
        axios({
            method: 'post',
            url: 'https://api.clarifai.com/v2/models/c0c0ac362b03416da06ab3fa36fb58e3/outputs',
            headers: {
                Authorization: `Key ${process.env.API_KEY_CLARIFAI}`
            },
            data: {
                "inputs": [
                    {
                        "data": {
                            "image": {
                                "url": `${url}`
                            }
                        }
                    }
                ]
            }
        })
            .then(({ data }) => {
                console.log(`masuk`);
                console.log(data);
                let age = data.outputs[0].data.regions[0].data.face.age_appearance.concepts[0].name
                let feminine = data.outputs[0].data.regions[0].data.face.gender_appearance.concepts[0].value
                let masculine = data.outputs[0].data.regions[0].data.face.gender_appearance.concepts[1].value
                let multicultural = data.outputs[0].data.regions[0].data.face.multicultural_appearance.concepts[0].name
                let image = url
                let dataChange = toUpdate(["age", "feminine", "masculine", "multicultural", "image"], { age, feminine, masculine, multicultural, image })
                console.log(dataChange);
                return Profile.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: dataChange
                    },
                    {
                        omitUndefined: true,
                        new: true
                    })
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
                return Profile.findByIdAndDelete(_id)
            })
            .then(success => {
                res.status(200).json({ success, message: 'success deleting profile' })
            })
            .catch(next)
    }

    static love(req, res, next) {
        const { fname, sname } = req.body
        axios({
            method: 'get',
            url: `https://love-calculator.p.rapidapi.com/getPercentage?fname=${fname}&sname=${sname}`,
            headers: {
                "X-RapidAPI-Host": "love-calculator.p.rapidapi.com",
	            "X-RapidAPI-Key": "1dd958d74bmsh12903858b9595dbp13929fjsn7bcae86db0e7"
            }
        })
        .then(({data})=>{
            const _id = req.params.id,
            value = data.percentage,
            user = req.loggedUser.id,
            lovers = { user, value }
            return Profile.findByIdAndUpdate(
                _id,
            {
                $push: { lovers }
            },
            {
                omitUndefined: true,
                new: true,
            })
        })
        .then(profile => {
            res.status(200).json({ profile, message: 'success updated profile' })
        })
        .catch(err => {
            console.log(err);
        })
    }

}

module.exports = ProfileC