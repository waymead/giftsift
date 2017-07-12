const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
    name: String,
    type: String,
    notes: String,
    created: {
        type: Date,
        default: Date.now()
    },
    gifts: [{
        type: Schema.Types.ObjectId,
        ref: 'Gift'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { collection: 'lists' });

listSchema.statics.findById = function(id) {
    return this.findOne({ _id: id, deleted: { $ne: true } }, {}, { sort: 'name' });
};

listSchema.statics.findByIdAndOwner = function(id, user) {
    return this.findOne({ _id: id, owner: user, deleted: { $ne: true } }, {}, { sort: 'name' })
        .populate('owner', 'members');
};

listSchema.statics.findByIdAndMember = function(id, user) {
    return this.findOne({ _id: id, members: user, deleted: { $ne: true } }, {}, { sort: 'name' })
        .populate('owner', 'members');
};

listSchema.statics.findByOwner = function(user) {
    return this.find({ owner: user, deleted: { $ne: true } }, {}, { sort: 'name' });
};

listSchema.statics.findByMember = function(user) {
    return this.find({ members: user, deleted: { $ne: true } }, {}, { sort: 'name' });
};

listSchema.statics.delete = function(id, user) {
    return this.findOneAndUpdate({ _id: id, owner: user }, { $set: { deleted: true } });
};

listSchema.statics.undelete = function(id, user) {
    return List.findOneAndUpdate({ _id: id, owner: user }, { $set: { deleted: false } });
};

listSchema.statics.join = function(id, user) {
    return this.findOneAndUpdate({ _id: id }, { $addToSet: { members: user } });
};

listSchema.statics.leave = function(id, user) {
    return this.findOneAndUpdate({ _id: id }, { $pull: { members: user._id } });
};

listSchema.methods.isOwner = function(user) {
    return this.owner.equals(user._id);
};

listSchema.methods.isMember = function(user) {
    return this.members.indexOf(user) > -1;
};

const List = mongoose.model('List', listSchema);

module.exports = List;