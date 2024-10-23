// utils/ruleParser.js

class Node {
    constructor(type, value = null, left = null, right = null) {
      this.type = type;
      this.value = value;
      this.left = left;
      this.right = right;
    }
  }
  
  function standardizeAst(ast) {
    if (!ast) return null;
  
    // Convert node type from 'operand' to 'condition'
    if (ast.type === 'operand') {
      return new Node('condition', {
        field: ast.value.left,
        operator: ast.value.operator,
        value: ast.value.right
      });
    }
  
    // Recursively standardize operator nodes
    if (ast.type === 'operator') {
      return new Node('operator', ast.value, 
        standardizeAst(ast.left), 
        standardizeAst(ast.right)
      );
    }
  
    return ast;
  }
  
  function combineRules(rules) {
    if (!rules || rules.length === 0) return null;
    if (rules.length === 1) return standardizeAst(rules[0]);
  
    // Standardize all rules before combining
    const standardizedRules = rules.map(rule => standardizeAst(rule));
    
    return standardizedRules.reduce((combined, rule) => 
      new Node('operator', 'AND', combined, rule)
    );
  }
  
  module.exports = {
    standardizeAst,
    combineRules
  };