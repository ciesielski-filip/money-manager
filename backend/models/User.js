const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: '#000000'
        }
    },
    {
        collection: "users",
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);