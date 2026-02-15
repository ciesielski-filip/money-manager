const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ['income', 'expense', 'transfer'],
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            // Wymuszenie podanania kategorii w momencie kiedy transakcja to nie transfer z konta na konto
            required: function () { return this.type !== 'transfer'; }
        },
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        },
        toAccount: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            // Tylko w przypadku kiedy transakcja to transfer
            required: function () { return this.type === 'transfer'; }
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        collection: "transactions",
        timestamps: true
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
