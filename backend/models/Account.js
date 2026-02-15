const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
        currency: {
            type: String,
            default: 'PLN'
        },
        initialBalance: {
            type: Number,
            default: 0
        },
    },
    {
        collection: "accounts",
        timestamps: true
    }
);

module.exports = mongoose.model('Account', accountSchema);
