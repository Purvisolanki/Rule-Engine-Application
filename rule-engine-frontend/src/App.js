// import React, { useState, useEffect } from 'react';
// import RuleForm from './components/RuleForm';
// import RuleList from './components/RuleList';
// import axios from 'axios';

// const App = () => {
//   const [rules, setRules] = useState([]);

//   useEffect(() => {
//     fetchRules();
//   }, []);

//   const fetchRules = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/rules'); // Fetch existing rules from the backend
//       setRules(response.data);
//     } catch (error) {
//       console.error('Error fetching rules', error);
//     }
//   };

//   const handleRuleCreated = (newRule) => {
//     setRules([...rules, newRule]); // Add the new rule to the list
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <RuleForm onRuleCreated={handleRuleCreated} />
//       <RuleList rules={rules} />
//     </div>
//   );
// };

// export default App;


// src/App.js
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import RuleList from './components/RuleList';
import CreateRule from './components/CreateRule';
import EvaluateRule from './components/EvaluateRule';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<RuleList />} />
          <Route path="/create" element={<CreateRule />} />
          <Route path="/evaluate" element={<EvaluateRule />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;