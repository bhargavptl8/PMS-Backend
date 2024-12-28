const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    projectManager: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },  
    clients: [{
        type: Schema.Types.ObjectId,
        ref: 'clients',
        required: true
    }],
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    submitDate:{
        type: Date,
    },
    status:{
        type: String,
        required: true,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PAUSED'],
        default: 'PENDING'
    }
}, { timestamps: true });

projectSchema.plugin(mongoosePaginate);

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;