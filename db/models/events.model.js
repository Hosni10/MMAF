import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  title: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
},
  time: {
    type: time,
    required: true
  },
  type: {
    type: String,
    enum: ['conference', 'workshop', 'seminar', 'meetup', 'festival', 'other'], // You can add more categories
    required: true
  }
}, { timestamps: true });

const Event = model('Event', eventSchema);

export default Event;
