// routes/ruleRoutes.js

const express = require('express');
const router = express.Router();
const Rule = require('../models/Rule');
const { createRule, evaluateRule } = require('../utils/ruleEngine');
const { standardizeAst, combineRules } = require('../utils/ruleParser');

router.post('/create', async (req, res) => {
  try {
    const { name, ruleString } = req.body;
    
    if (!name || !ruleString) {
      throw new Error('Name and rule string are required');
    }

    const ast = createRule(ruleString);
    console.log('Created AST:', JSON.stringify(ast, null, 2));

    const rule = new Rule({ name, ruleString, ast });
    await rule.save();
    
    res.status(201).json(rule);
  } catch (error) {
    console.error('Error creating rule:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/combine', async (req, res) => {
  try {
    const { ruleIds } = req.body;
    
    if (!Array.isArray(ruleIds) || ruleIds.length === 0) {
      throw new Error('At least one rule ID is required');
    }

    const rules = await Rule.find({ _id: { $in: ruleIds } });
    if (rules.length !== ruleIds.length) {
      throw new Error('Some rules were not found');
    }

    const rulesAst = rules.map(r => r.ast);
    const combinedAst = combineRules(rulesAst);
    
    res.json(combinedAst);
  } catch (error) {
    console.error('Error combining rules:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/evaluate', async (req, res) => {
  try {
    const { ast, data } = req.body;
    
    if (!ast || !data) {
      throw new Error('AST and data are required');
    }

    console.log('Evaluating AST:', JSON.stringify(ast, null, 2));
    console.log('With data:', JSON.stringify(data, null, 2));

    const requiredFields = ['age', 'department', 'salary', 'experience'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const result = evaluateRule(ast, data);
    res.json({ result });
  } catch (error) {
    console.error('Error evaluating rule:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;