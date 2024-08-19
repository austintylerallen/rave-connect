const mongoose = require('mongoose');
const User = require('./User');

const promoterSchema = new mongoose.Schema({
  ...User.schema.obj,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

module.exports = mongoose.model('Promoter', promoterSchema);
