// import React, { useState } from 'react';
// import { combineRules, evaluateRule } from '../services/ruleService';
// import { Button, Checkbox, List, ListItem, ListItemText, Typography } from '@mui/material';

// const RuleList = ({ rules }) => {
//   const [selectedRules, setSelectedRules] = useState([]);
//   const [evaluationData, setEvaluationData] = useState('');
//   const [evaluationResult, setEvaluationResult] = useState(null);

//   const handleToggle = (ruleId) => {
//     const currentIndex = selectedRules.indexOf(ruleId);
//     const newChecked = [...selectedRules];

//     if (currentIndex === -1) {
//       newChecked.push(ruleId);
//     } else {
//       newChecked.splice(currentIndex, 1);
//     }

//     setSelectedRules(newChecked);
//   };

//   const handleCombineRules = async () => {
//     try {
//       const combinedAst = await combineRules(selectedRules);
//       console.log('Combined AST:', combinedAst);
//     } catch (error) {
//       console.error('Error combining rules', error);
//     }
//   };

//   const handleEvaluateRule = async (ruleId) => {
//     const data = JSON.parse(evaluationData); // Sample user data (e.g. {"age": 35, "department": "Sales"})
//     try {
//       const result = await evaluateRule(ruleId, data);
//       setEvaluationResult(result);
//     } catch (error) {
//       console.error('Error evaluating rule', error);
//     }
//   };

//   return (
//     <div>
//       <Typography variant="h6">Rules</Typography>
//       <List>
//         {rules.map((rule) => (
//           <ListItem key={rule._id} button onClick={() => handleToggle(rule._id)}>
//             <Checkbox checked={selectedRules.indexOf(rule._id) !== -1} />
//             <ListItemText primary={rule.ruleString} />
//             <Button onClick={() => handleEvaluateRule(rule._id)} variant="contained">Evaluate</Button>
//           </ListItem>
//         ))}
//       </List>
//       <Button onClick={handleCombineRules} variant="contained" color="secondary">
//         Combine Selected Rules
//       </Button>
//       <div>
//         <Typography variant="h6">Evaluation Data (JSON)</Typography>
//         <textarea
//           value={evaluationData}
//           onChange={(e) => setEvaluationData(e.target.value)}
//           rows="4"
//           cols="50"
//           placeholder='{"age": 35, "department": "Sales", "salary": 60000}'
//         />
//         {evaluationResult && (
//           <Typography variant="h6">Evaluation Result: {evaluationResult.result ? "True" : "False"}</Typography>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RuleList;


// src/components/RuleList.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

function RuleList() {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rules')
      .then(response => setRules(response.data))
      .catch(error => console.error('Error fetching rules:', error));
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>Rules</Typography>
      <Paper elevation={3}>
        <List>
          {rules.map(rule => (
            <ListItem key={rule._id}>
              <ListItemText primary={rule.name} secondary={JSON.stringify(rule.ast)} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default RuleList;