// utils/counter.js
const { Counter } = require("../models/Property");

const getNextSequenceValue = async (sequenceName) => {
  const result = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return result.sequence_value;
};

module.exports = getNextSequenceValue;
