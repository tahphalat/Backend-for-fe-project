const express = require('express');
const { getCars, getCar, createCar, updateCar, deleteCar } = require('../controllers/cars');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const bookingRouter = require('./bookings');
// router.route('/').get(getCars).post(createCar);
// router.route('/:id').get(getCar).put(updateCar).delete(deleteCar);
router.use('/:carId/bookings/', bookingRouter);
router.route('/').get(getCars).post(protect, authorize('admin'), createCar);
router.route('/:id').get(getCar).put(protect, authorize('admin'), updateCar).delete(protect, authorize('admin'), deleteCar);

module.exports = router;
 