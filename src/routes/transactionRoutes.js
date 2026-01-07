const router = require('express').Router();
const { getTransactions, createTransaction, getTransactionByDate } = require('../controllers/transactionController');

router.route('/')
    .get(getTransactions)
    .post(createTransaction);

router.route('/:date')
    .get(getTransactionByDate);


module.exports = router;
