const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: String,
  date: String,
  labels: [{ color: String, text: String }],
  tasks: [
    {
      id: Number,
      text: String,
      completed: Boolean,
    },
  ],
});

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cards: [cardSchema],
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
