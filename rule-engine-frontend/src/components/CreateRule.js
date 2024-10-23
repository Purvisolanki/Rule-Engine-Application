// src/components/CreateRule.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import axios from 'axios';

function CreateRule() {
  const [name, setName] = useState('');
  const [ruleString, setRuleString] = useState('');
  const [preview, setPreview] = useState(null);

  const sampleRules = [
    {
      name: "Sales and Marketing Rule",
      rule: "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
    },
    {
      name: "Marketing Experience Rule",
      rule: "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)"
    }
  ];

  const handlePreview = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/rules/preview', {
        ruleString
      });
      setPreview(response.data);
    } catch (error) {
      alert('Error previewing rule: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/rules/create', { name, ruleString });
      alert('Rule created successfully!');
      setName('');
      setRuleString('');
      setPreview(null);
    } catch (error) {
      alert('Error creating rule: ' + error.message);
    }
  };

  const handleUseSample = (sample) => {
    setName(sample.name);
    setRuleString(sample.rule);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Create Rule
            <Tooltip title="Rules are created using conditional expressions with AND/OR operators">
              <IconButton size="small">
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </Grid>

        {/* Sample Rules Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Sample Rules</Typography>
          <Grid container spacing={2}>
            {sampleRules.map((sample, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>{sample.name}</Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '1rem' }}>
                      {sample.rule}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleUseSample(sample)}
                    >
                      Use This Rule
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Rule Creation Form */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Rule Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                helperText="Give your rule a descriptive name"
              />
              <TextField
                fullWidth
                label="Rule Expression"
                value={ruleString}
                onChange={(e) => setRuleString(e.target.value)}
                margin="normal"
                multiline
                rows={4}
                helperText={
                  <span>
                    {/* Use operators: AND, OR, >, <, =<br />
                    Available fields: age, department, salary, experience<br />
                    Example: (age > 30 AND department = 'Sales') */}
                  </span>
                }
              />
              <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                <Grid item>
                  <Button onClick={handlePreview} variant="outlined">
                    Preview AST
                  </Button>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" color="primary">
                    Create Rule
                  </Button>
                </Grid>
              </Grid>
            </form>

            {preview && (
              <div style={{ marginTop: '2rem' }}>
                <Typography variant="h6">Rule Preview</Typography>
                <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
                  {JSON.stringify(preview, null, 2)}
                </pre>
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CreateRule;