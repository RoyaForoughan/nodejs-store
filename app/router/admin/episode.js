const { EpisodeController } = require('../../http/controllers/admin/course/episodeContoller')
const { uploadVideo } = require('../../utils/multer')

const router = require('express').Router()

router.post('/add' , uploadVideo.single("video"),EpisodeController.addNewEpisode)
router.delete('/remove/:episodeID' , EpisodeController.removeEpisode )
module.exports = {
    AdminApiEpisodeRouter : router
}