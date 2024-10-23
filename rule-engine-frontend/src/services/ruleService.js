import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rules'; // Backend API URL

export const createRule = async (ruleString) => {
  try {
    const response = await axios.post(`${API_URL}/create`, { ruleString });
    return response.data;
  } catch (error) {
    console.error("Error creating rule", error);
    throw error;
  }
};

export const combineRules = async (ruleIds) => {
  try {
    const response = await axios.post(`${API_URL}/combine`, { ruleIds });
    return response.data;
  } catch (error) {
    console.error("Error combining rules", error);
    throw error;
  }
};

export const evaluateRule = async (ruleId, data) => {
  try {
    const response = await axios.post(`${API_URL}/evaluate`, { ruleId, data });
    return response.data;
  } catch (error) {
    console.error("Error evaluating rule", error);
    throw error;
  }
};
