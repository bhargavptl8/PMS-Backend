const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const schema = mongoose.Schema;

const clientSchema = new schema({
    clientName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    goldDigger: {
        type: String,
        enum: ['YES', 'NO'],
        default: 'NO'
    },

}, { timestamps: true });

clientSchema.plugin(mongoosePaginate);

const Client = mongoose.model("clients", clientSchema);
module.exports = Client;
