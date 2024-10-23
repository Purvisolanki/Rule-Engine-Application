// src/components/EvaluateRule.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

function EvaluateRule() {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [userData, setUserData] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleUserData = {
    age: 35,
    department: "Sales",
    salary: 60000,
    experience: 3
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/rules')
      .then(response => setRules(response.data))
      .catch(error => {
        console.error('Error fetching rules:', error);
        setError('Failed to fetch rules. Please try again later.');
      });
  }, []);

  const handleUseSampleData = () => {
    setUserData(JSON.stringify(sampleUserData, null, 2));
  };

  const handleEvaluate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let data = userData;
      try {
        data = typeof userData === 'string' ? JSON.parse(userData) : userData;
      } catch (e) {
        throw new Error('Invalid JSON format for user data');
      }

      const combinedResponse = await axios.post('http://localhost:5000/api/rules/combine', {
        ruleIds: selectedRules
      });
      const combinedAst = combinedResponse.data;
      
      const evaluateResponse = await axios.post('http://localhost:5000/api/rules/evaluate', {
        ast: combinedAst,
        data
      });
      
      setResult(evaluateResponse.data.result);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>Evaluate Rules</Typography>
        </Grid>

        {/* Rule Selection */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '2rem', height: '100%' }}>
            <Typography variant="h6" gutterBottom>1. Select Rules to Evaluate</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Rules</InputLabel>
              <Select
                multiple
                value={selectedRules}
                onChange={(e) => setSelectedRules(e.target.value)}
              >
                {rules.map(rule => (
                  <MenuItem key={rule._id} value={rule._id}>
                    {rule.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* User Data Input */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '2rem', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              2. Enter User Data
              <Button
                size="small"
                variant="outlined"
                onClick={handleUseSampleData}
                style={{ marginLeft: '1rem' }}
              >
                Use Sample Data
              </Button>
            </Typography>
            <TextField
              fullWidth
              label="User Data (JSON)"
              value={userData}
              onChange={(e) => setUserData(e.target.value)}
              margin="normal"
              multiline
              rows={4}
              helperText="Enter JSON object with age, department, salary, and experience fields"
            />
          </Paper>
        </Grid>

        {/* Evaluation Section */}
        <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <Button
            onClick={handleEvaluate}
            variant="contained"
            color="primary"
            disabled={!selectedRules.length || !userData || isLoading}
            fullWidth
          >
            {isLoading ? <CircularProgress size={24} /> : 'Evaluate Rules'}
          </Button>

          {error && (
            <Alert severity="error" style={{ marginTop: '1rem' }}>
              {error}
            </Alert>
          )}

          {result !== null && !error && (
            <Alert
              severity={result ? "success" : "info"}
              style={{ marginTop: '1rem' }}
            >
              Result: {result ? "User matches the selected rules" : "User does not match the selected rules"}
            </Alert>
          )}
        </Paper>
      </Grid>
      </Grid>
    </Container>
  );
}

export default EvaluateRule;