// utils/ruleEngine.js

class Node {
  constructor(type, value = null, left = null, right = null) {
    this.type = type;  // 'operator' or 'condition'
    this.value = value;
    this.left = left;
    this.right = right;
  }

  toJSON() {
    return {
      type: this.type,
      value: this.value,
      left: this.left,
      right: this.right
    };
  }
}

function createRule(ruleString) {
  try {
    const tokens = tokenize(ruleString);
    return parseExpression(tokens);
  } catch (error) {
    throw new Error(`Error creating rule: ${error.message}`);
  }
}

function tokenize(ruleString) {
  if (!ruleString || typeof ruleString !== 'string') {
    throw new Error('Rule string must be a non-empty string');
  }

  // Match operators, parentheses, words, quoted strings, and numbers
  const regex = /(\(|\)|AND|OR|[<>=]=?|\w+|'[^']*'|\d+)/g;
  const tokens = ruleString.match(regex);

  if (!tokens) {
    throw new Error('Invalid rule string format');
  }

  return tokens;
}

function parseExpression(tokens) {
  let node = parseAndExpression(tokens);

  while (tokens.length > 0 && tokens[0] === 'OR') {
    tokens.shift(); // consume 'OR'
    const right = parseAndExpression(tokens);
    node = new Node('operator', 'OR', node, right);
  }

  return node;
}

function parseAndExpression(tokens) {
  let node = parseTerm(tokens);

  while (tokens.length > 0 && tokens[0] === 'AND') {
    tokens.shift(); // consume 'AND'
    const right = parseTerm(tokens);
    node = new Node('operator', 'AND', node, right);
  }

  return node;
}

function parseTerm(tokens) {
  if (!tokens.length) {
    throw new Error('Unexpected end of expression');
  }

  if (tokens[0] === '(') {
    tokens.shift(); // consume '('
    const node = parseExpression(tokens);
    
    if (!tokens.length || tokens[0] !== ')') {
      throw new Error('Missing closing parenthesis');
    }
    
    tokens.shift(); // consume ')'
    return node;
  }

  return parseCondition(tokens);
}

function parseCondition(tokens) {
  if (tokens.length < 3) {
    throw new Error('Invalid condition format - requires field, operator, and value');
  }

  const field = tokens.shift();
  const operator = tokens.shift();
  const value = tokens.shift();

  // Validate operator
  if (!['>', '<', '=', '>=', '<='].includes(operator)) {
    throw new Error(`Invalid operator: ${operator}`);
  }

  return new Node('condition', {
    field,
    operator,
    value
  });
}

function standardizeNode(node) {
  if (!node) return null;

  // If node is a string (serialized JSON), parse it
  const parsedNode = typeof node === 'string' ? JSON.parse(node) : node;

  // Convert 'operand' type to 'condition' type
  if (parsedNode.type === 'operand') {
    return new Node('condition', {
      field: parsedNode.value.left,
      operator: parsedNode.value.operator,
      value: parsedNode.value.right
    });
  }

  // Recursively standardize operator nodes
  if (parsedNode.type === 'operator') {
    return new Node(
      'operator',
      parsedNode.value,
      standardizeNode(parsedNode.left),
      standardizeNode(parsedNode.right)
    );
  }

  return parsedNode;
}

function combineRules(rules) {
  if (!Array.isArray(rules)) {
    throw new Error('Rules must be an array');
  }

  if (rules.length === 0) return null;
  if (rules.length === 1) return standardizeNode(rules[0]);

  // Standardize and combine all rules with AND operator
  return rules
    .map(rule => standardizeNode(rule))
    .reduce((combined, rule) => new Node('operator', 'AND', combined, rule));
}

function evaluateRule(ast, data) {
  try {
    // Handle string representation of AST
    const node = standardizeNode(ast);

    if (!node) return true;

    switch (node.type) {
      case 'operator': {
        const leftResult = evaluateRule(node.left, data);
        const rightResult = evaluateRule(node.right, data);
        return node.value === 'AND' ? leftResult && rightResult : leftResult || rightResult;
      }

      case 'condition':
      case 'operand': {
        return evaluateCondition(node.value, data);
      }

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  } catch (error) {
    console.error('Evaluation error:', error);
    throw new Error(`Rule evaluation failed: ${error.message}`);
  }
}

function evaluateCondition(condition, data) {
  // Handle both formats of condition value
  const field = condition.field || condition.left;
  const operator = condition.operator || condition.operator;
  const value = condition.value || condition.right;

  // Validate data field exists
  if (!(field in data)) {
    throw new Error(`Missing field in data: ${field}`);
  }

  const fieldValue = data[field];
  
  // Handle string values (remove quotes) or convert to number
  const compareValue = value.startsWith("'") && value.endsWith("'")
    ? value.slice(1, -1)
    : parseFloat(value);

  // Handle type mismatches
  if (typeof fieldValue !== typeof compareValue) {
    throw new Error(`Type mismatch for field ${field}: expected ${typeof compareValue}, got ${typeof fieldValue}`);
  }

  switch (operator) {
    case '>':
      return fieldValue > compareValue;
    case '<':
      return fieldValue < compareValue;
    case '=':
      return fieldValue === compareValue;
    case '>=':
      return fieldValue >= compareValue;
    case '<=':
      return fieldValue <= compareValue;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

function validateRuleData(data) {
  const requiredFields = ['age', 'department', 'salary', 'experience'];
  const missingFields = requiredFields.filter(field => !(field in data));
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate data types
  if (typeof data.age !== 'number') throw new Error('Age must be a number');
  if (typeof data.department !== 'string') throw new Error('Department must be a string');
  if (typeof data.salary !== 'number') throw new Error('Salary must be a number');
  if (typeof data.experience !== 'number') throw new Error('Experience must be a number');
}

// Debug function to visualize AST
function debugAST(ast, indent = '') {
  if (!ast) return 'null';

  const node = standardizeNode(ast);
  return JSON.stringify(node, null, 2);
}

module.exports = {
  createRule,
  combineRules,
  evaluateRule,
  validateRuleData,
  debugAST,
  Node
};