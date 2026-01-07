const express = require('express');
const router = express.Router();
const {
    getMachineProfiles,
    createMachineProfile,
    getMachineProfilebyMachineId,
    getAllMachineStatus,
    getMachineStatus,
    getAllMachinesInactiveTime,
    getMachineInactiveTime
} = require('../controllers/machineController');

router.route('/')
    .get(getMachineProfiles)
    .post(createMachineProfile);

router.route('/status')
    .get(getAllMachineStatus);

router.route('/inactive-time')
    .get(getAllMachinesInactiveTime);

router.route('/:id/status')
    .get(getMachineStatus);

router.route('/:id/inactive-time')
    .get(getMachineInactiveTime);

router.route('/:id')
    .get(getMachineProfilebyMachineId);


module.exports = router;