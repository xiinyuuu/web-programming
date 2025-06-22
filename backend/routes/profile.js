const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// GET profile
router.get('/', auth, profileController.getProfile);
// GET all reviews
router.get('/reviews', auth, profileController.getAllReviews);
// UPDATE profile info
router.put('/', auth, profileController.updateProfile);
// UPDATE password
router.put('/password', auth, profileController.changePassword);
// DEACTIVATE account
router.put('/deactivate', auth, profileController.deactivateAccount);
// DELETE account
router.delete('/', auth, profileController.deleteAccount);
// UPDATE profile picture
router.put('/profile-pic', auth, profileController.updateProfilePic);

module.exports = router;
