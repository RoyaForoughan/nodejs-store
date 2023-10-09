const { ChapterController } = require('../../http/controllers/admin/course/chapterController')

const router = require('express').Router()

router.put('/add', ChapterController.addChapter)
router.get('/list/:courseID', ChapterController.chaptersOfCourse)
router.patch('/remove/:chapterID', ChapterController.removeChapterById)
router.patch('/update/:chapterID', ChapterController.updateChapterById)

module.exports = {
    AdminApiChapterRouter : router
}