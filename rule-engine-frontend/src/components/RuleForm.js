import React, { useState } from 'react';
import { createRule } from '../services/ruleService';
import { Button, TextField, Typography } from '@mui/material';

const RuleForm = ({ onRuleCreated }) => {
  const [ruleString, setRuleString] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRule = await createRule(ruleString);
      setRuleString('');
      onRuleCreated(newRule); // Notify parent about the new rule
    } catch (error) {
      setError('Error creating rule');
    }
  };

  return (
    <div>
      <Typography variant="h6">Create a New Rule</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Rule String"
          value={ruleString}
          onChange={(e) => setRuleString(e.target.value)}
          fullWidth
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary">
          Create Rule
        </Button>
      </form>
    </div>
  );
};

export default RuleForm;
