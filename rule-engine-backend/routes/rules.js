const express = require('express');
const router = express.Router();
const Rule = require('../models/Rule');
const { createRule, combineRules, evaluateRule } = require('../services/RuleService');

// Route to create a new rule
router.post('/create', async (req, res) => {
  const { ruleString } = req.body;
  try {
    const ast = createRule(ruleString);
    const rule = new Rule({ ruleString, ast });
    await rule.save();
    res.json({ success: true, ast });
  } catch (error) {
    res.status(500).json({ error: 'Error creating rule' });
  }
});

// Route to combine multiple rules
router.post('/combine', async (req, res) => {
  const { ruleIds } = req.body;
  try {
    const rules = await Rule.find({ _id: { $in: ruleIds } });
    const asts = rules.map(rule => rule.ast);
    const combinedAst = combineRules(asts);
    res.json({ success: true, combinedAst });
  } catch (error) {
    res.status(500).json({ error: 'Error combining rules' });
  }
});

// Route to evaluate a rule
router.post('/evaluate', async (req, res) => {
  const { ruleId, data } = req.body;
  try {
    const rule = await Rule.findById(ruleId);
    const result = evaluateRule(rule.ast, data);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: 'Error evaluating rule' });
  }
});

module.exports = router;
