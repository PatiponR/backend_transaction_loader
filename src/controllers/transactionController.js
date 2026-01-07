const Transaction = require('../models/transaction');

exports.getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json({ success: true, data: transactions });
    } catch (err) {
        next(err);
    }
};

exports.getTransactionByDate = async (req, res, next) => {
    try {
        const dateStr = req.params.date;
        const startDate = new Date(dateStr);

        // Validate date
        if (isNaN(startDate.getTime())) {
            return res.status(400).json({ success: false, error: 'Invalid date format' });
        }

        // Set to start of day (00:00:00.000)
        startDate.setHours(0, 0, 0, 0);

        // Set to end of day (23:59:59.999)
        const endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);

        const transactions = await Transaction.find({
            transactionDate: {
                $gte: startDate,
                $lte: endDate
            }
        });
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (err) {
        next(err);
    }
}

exports.createTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.create(req.body);

        // Emit socket event
        const io = req.app.get('io');
        io.emit('newTransaction', transaction);

        res.status(201).json({ success: true, data: transaction });
    } catch (err) {
        next(err);
    }
};

