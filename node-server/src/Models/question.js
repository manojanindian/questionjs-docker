const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
    questionId: {
        type: String,
        required: true
    },
  question: {
      type: String,
      required: true
  },
  functionName: {
      type: String,
      required: true
  },
  published: {
      type: Boolean,
      required: true
  },
  createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
      },
  unitTests: [
      {
          desc: {
              type: String,
              required: true
          },
          input: {
              type: String,
              required: true
          },
          output: {
              type: mongoose.Schema.Types.Mixed,
              required: true
          },
      }
  ]
});

module.exports = mongoose.model("Questions", questionSchema);