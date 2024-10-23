// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const nodeSchema = new Schema({
//   type: { type: String, required: true }, // "operator" or "operand"
//   left: { type: Schema.Types.Mixed, default: null }, // Reference to another node
//   right: { type: Schema.Types.Mixed, default: null }, // Reference to another node
//   value: { type: Schema.Types.Mixed, default: null }, // Operand value
// });

// const ruleSchema = new Schema({
//   ruleString: { type: String, required: true }, // Original rule string
//   ast: nodeSchema, // The AST root node
//   created_at: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Rule', ruleSchema);

// models/Rule.js

const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ruleString: {
    type: String,
    required: true
  },
  ast: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

const Rule = mongoose.model('Rule', RuleSchema);

module.exports = Rule;