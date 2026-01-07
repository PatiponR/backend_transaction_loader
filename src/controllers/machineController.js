const MachineProfile = require('../models/MachineProfiles');
const Transaction = require('../models/transaction');

exports.getMachineProfiles = async (req, res, next) => {
    try {
        const machineProfiles = await MachineProfile.find();
        res.status(200).json({ success: true, data: machineProfiles });
    } catch (err) {
        next(err);
    }
};

exports.createMachineProfile = async (req, res, next) => {
    try {
        const machineProfile = await MachineProfile.create(req.body);
        res.status(201).json({ success: true, data: machineProfile });
    } catch (err) {
        next(err);
    }
};

exports.getMachineProfilebyMachineId = async (req, res, next) => {
    try {
        const machineProfile = await MachineProfile.findOne({ machineId: req.params.id });
        res.status(200).json({ success: true, data: machineProfile });
    } catch (err) {
        next(err);
    }
};

exports.getAllMachineStatus = async (req, res, next) => {
    try {
        const { startDate, endDate } = getQueryDates(req.query);
        const machines = await MachineProfile.find();

        const statusList = await Promise.all(machines.map(async (machine) => {
            return await getLatestInactiveDuration(machine, startDate, endDate);
        }));

        res.status(200).json({ success: true, count: statusList.length, data: statusList });
    } catch (err) {
        next(err);
    }
};

exports.getMachineStatus = async (req, res, next) => {
    try {
        const { startDate, endDate } = getQueryDates(req.query);
        const machine = await MachineProfile.findOne({ machineId: req.params.id });

        if (!machine) {
            return res.status(404).json({ success: false, error: 'Machine not found' });
        }

        const status = await getLatestInactiveDuration(machine, startDate, endDate);
        res.status(200).json({ success: true, data: status });
    } catch (err) {
        next(err);
    }
};

exports.getAllMachinesInactiveTime = async (req, res, next) => {
    try {
        const { startDate, endDate } = getQueryDates(req.query);
        const machines = await MachineProfile.find();

        const result = await Promise.all(machines.map(async (machine) => {
            const totalInactive = await calculateTotalInactiveTime(machine, startDate, endDate);
            return {
                machineId: machine.machineId,
                name: machine.name,
                totalInactiveMinutes: totalInactive
            };
        }));

        res.status(200).json({ success: true, count: result.length, data: result });
    } catch (err) {
        next(err);
    }
};

exports.getMachineInactiveTime = async (req, res, next) => {
    try {
        const { startDate, endDate } = getQueryDates(req.query);
        const machine = await MachineProfile.findOne({ machineId: req.params.id });

        if (!machine) {
            return res.status(404).json({ success: false, error: 'Machine not found' });
        }

        const totalInactive = await calculateTotalInactiveTime(machine, startDate, endDate);
        res.status(200).json({
            success: true,
            data: {
                machineId: machine.machineId,
                name: machine.name,
                totalInactiveMinutes: totalInactive
            }
        });
    } catch (err) {
        next(err);
    }
};

// Helper functions
const getQueryDates = (query) => {
    let start = query.startDate ? new Date(query.startDate) : new Date();
    let end = query.endDate ? new Date(query.endDate) : new Date();

    // If dates are invalid, fallback to now
    if (isNaN(start.getTime())) start = new Date();
    if (isNaN(end.getTime())) end = new Date();

    if (!query.startDate) start.setHours(0, 0, 0, 0);
    if (!query.endDate) end.setHours(23, 59, 59, 999);

    return { startDate: start, endDate: end };
};


const calculateTotalInactiveTime = async (machine, startDate, endDate) => {
    // 1. Get initial state: last transaction BEFORE startDate
    const initialStateTx = await Transaction.findOne({
        machineId: machine.machineId,
        transactionDate: { $lt: startDate }
    }).sort({ transactionDate: -1 });

    // 2. Get all transactions WITHIN range, sorted ASC
    const transactions = await Transaction.find({
        machineId: machine.machineId,
        transactionDate: { $gte: startDate, $lte: endDate }
    }).sort({ transactionDate: 1 });

    let totalInactiveMs = 0;
    let currentTime = startDate.getTime();
    let isInactive = false;

    // Determine initial state
    if (initialStateTx && initialStateTx.transactionAmount === 0) {
        isInactive = true;
    }

    // Iterate through transactions
    for (const tx of transactions) {
        const txTime = tx.transactionDate.getTime();

        if (isInactive) {
            totalInactiveMs += (txTime - currentTime);
        }

        // Update state and current time
        isInactive = (tx.transactionAmount === 0);
        currentTime = txTime;
    }

    // Handle time after last transaction up to endDate (or now if endDate is future)
    const now = Date.now();
    const end = endDate.getTime();
    const refTime = end > now ? now : end;

    if (isInactive && currentTime < refTime) {
        totalInactiveMs += (refTime - currentTime);
    }

    return Math.round((totalInactiveMs / (1000 * 60)) * 100) / 100;
};

const getLatestInactiveDuration = async (machine, startDate, endDate) => {
    const lastTransaction = await Transaction.findOne({
        machineId: machine.machineId,
        transactionDate: { $gte: startDate, $lte: endDate }
    }).sort({ transactionDate: -1 });

    if (!lastTransaction) {
        return {
            machineId: machine.machineId,
            name: machine.name,
            status: 'Unknown',
            duration: 0,
            lastTransaction: null
        };
    }

    let status = 'Active';
    let duration = 0;

    if (lastTransaction.transactionAmount === 0) {
        status = 'Inactive';
        const now = Date.now();
        const end = endDate.getTime();
        // Calculate duration up to now or end of range, whichever is earlier
        // However, if looking at past range, we want up to end of range.
        // If range extends to future (default today), we want up to now.
        const refTime = end > now ? now : end;
        const diffMs = refTime - lastTransaction.transactionDate.getTime();
        duration = Math.round((diffMs / (1000 * 60)) * 100) / 100; // Minutes with 2 decimal places

        // Ensure non-negative
        if (duration < 0) duration = 0;
    }

    return {
        machineId: machine.machineId,
        name: machine.name,
        status,
        duration, // minutes
        lastTransaction
    };
};
