                                                                         Application- 1
Rule Engine with AST

Rule Engine with AST
A powerful rule engine implementation using Abstract Syntax Trees (AST) built with the MERN stack (MongoDB, Express.js, React, Material UI). The system allows for dynamic creation, combination, and evaluation of business rules using a simple and intuitive interface.
Features
Create complex rules with AND/OR operators and parentheses
Combine multiple rules into a single evaluation
Evaluate user data against rules
Beautiful Material UI interface
Support for various comparison operators (>, <, =, >=, <=)
Handles nested conditions and complex rule combinations

Prerequisites
Before running this project, make sure you have the following installed:
Node.js (v14.0.0 or higher)
MongoDB (v4.0.0 or higher)
npm (v6.0.0 or higher)
git

Application video - 
https://drive.google.com/file/d/1jDdEImJoutVtOtLAQ-izwPrkHELeZVCn/view?usp=sharing

Installation & Setup
1. Clone the Repository
git clone https://github.com/Purvisolanki/Rule-Engine-Application

cd Rule-Engine-Application

2. Backend Setup
# Navigate to backend directory
cd rule-engine-backend

# Install dependencies
npm install

For database - I used MongoDb, so you have to sign up at mongodb atlas and generate your url from cluster.you can see stored data at mongodb compass.

Replace with this my MONGODB_URL.

3. Frontend Setup
# Navigate to frontend directory
cd ../rule-engine-frontend

# Install dependencies
npm install


Running the Application-

1. Start Backend Server
# In the backend directory
cd rule-engine-backend
npm node index.js
The backend server will start on port 5000.
Your terminal will look like-


2. Start Frontend Application
# In the frontend 

cd rule-engine-frontend
npm start
The frontend application will start on port 3000.

Your terminal will look like

3. Access the Application
Open your browser and navigate to:
http://localhost:3000



Thank you
