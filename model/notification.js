const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'projects',
    }],
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    managerEmail: {
        type: String
    }
}, { timestamps: true });


const Notification = mongoose.model("notifications", notificationSchema);
module.exports = Notification;
