const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    userId: 
        {
        type: String
        },
    purchaseHistory: [
        {
        visitId: { 
            type: String
            },
        locationName: {
            type: String
            },
        date: {
            type: Date,
            default: Date.now
            }
        }
        ]
    });

module.exports = User = mongoose.model('users', UserSchema);