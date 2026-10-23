const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Technical', 'Cultural', 'Sports', 'Academic'], 
    required: true 
  },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  time: { type: String, required: true }, // Format HH:MM AM/PM
  venue: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 },
  imageUrl: { type: String, default: '' },
  createdBy: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const RegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: String, required: true, ref: 'User' },
  registeredAt: { type: Date, default: Date.now },
  ticketId: { type: String, required: true, unique: true }
});

const MongooseUser = mongoose.model('User', UserSchema);
const MongooseEvent = mongoose.model('Event', EventSchema);
const MongooseRegistration = mongoose.model('Registration', RegistrationSchema);

module.exports = {
  UserSchema,
  EventSchema,
  RegistrationSchema,
  MongooseUser,
  MongooseEvent,
  MongooseRegistration
};
