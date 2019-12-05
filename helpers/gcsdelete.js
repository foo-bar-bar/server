const { Storage } = require('@google-cloud/storage')
const CLOUD_BUCKET = process.env.CLOUD_BUCKET
const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
})
async function deleteFileFromGCS(url) {
    if (!url) return
    let filename = url.split('/').pop()
    try {
        await storage
            .bucket(CLOUD_BUCKET)
            .file(filename)
            .delete()
    }
    catch (err) {
        throw err
    }
}
module.exports = deleteFileFromGCS