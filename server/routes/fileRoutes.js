const express = require('express');
const router = express.Router();
const { downloadFile, getProjectFiles, deleteProjectFile } = require('../controllers/fileController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:id/files', getProjectFiles);
router.get('/:id/files/:docId/download', downloadFile);
router.delete('/:id/files/:docId', deleteProjectFile);

module.exports = router;
