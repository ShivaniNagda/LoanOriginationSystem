# Loan Origination & Approval System

A full-stack loan management system built with Node.js (Express), MongoDB (Mongoose), and React. This system allows customers to apply for loans, automatically calculates eligibility scores, and enables loan officers to review and approve/reject applications.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (Customer/Officer)
- **Customer Features**:
  - Register and login
  - Update profile (income, credit score)
  - Apply for loans
  - View loan application status and eligibility scores
- **Officer Features**:
  - View pending loan applications
  - Review and approve/reject loan applications
  - View review history
- **Automatic Eligibility Scoring**: System automatically calculates eligibility scores based on income and credit score

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Tokens)
- bcryptjs for password hashing
- dotenv for environment variables

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- React Toastify for notifications
- Context API for state management

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   └── mongodb.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── customer.controller.js
│   │   ├── loan.controller.js
│   │   └── officer.controller.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── customer.model.js
│   │   ├── loanApplication.model.js
│   │   ├── loanOfficer.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.rote.js
│   │   ├── customer.route.js
│   │   ├── loans.route.js
│   │   └── officer.route.js
│   ├── services/
│   │   └── loanService.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
        ├── assets/
│   │   │   ├── logo
│   │   ├── components/
│   │   │   ├── css
│   │   │   ├── Footer.css
│   │   │   ├── Loader.js
│   │   │   ├── Navbar.js
│   │   │   └── ProtetedRoute.css
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Css
│   │   │   ├── CustomerDashboard.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── OfficerDashboard.js
│   │   │   ├── PageNotFound.js
│   │   │   └── Register.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
 .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loan-origination
JWT_SECRET=shivani
NODE_ENV=development
```

5. Make sure MongoDB is running on your system.

6. Start the backend server:
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## MongoDB Connection and Seed Data

### MongoDB Connection

The application connects to MongoDB using the connection string specified in the `.env` file. Make sure MongoDB is running before starting the backend server.

### Seed Data (Optional)

You can manually create test users through the registration endpoint:

**Register as Customer:**
```bash
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

**Register as Officer:**
```bash
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "Jane Officer",
  "email": "jane@example.com",
  "password": "password123",
  "role": "OFFICER"
}
```

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "P@ssw0rd",
  "role": "CUSTOMER" | "OFFICER"
}

Response: {
  "message": "User registered successfully",
  "userId": "<ObjectId>"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "ravi@example.com",
  "password": "P@ssw0rd"
}

Response: {
  "token": "<jwt>",
  "userId": "<ObjectId>",
  "role": "CUSTOMER"
}
```

### Customer Endpoints

#### Get Customer Profile
```
GET /customer/profile
Authorization: Bearer <token>

Response: {
  "_id": "<ObjectId>",
  "userId": { "name": "...", "email": "..." },
  "income": 500000,
  "creditScore": 750
}
```

#### Update Customer Profile
```
PUT /customer/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "income": 500000,
  "creditScore": 750
}

Response: {
  "message": "Profile updated successfully",
  "customer": { ... }
}
```

### Loan Endpoints

#### Apply for Loan
```
POST /loans/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "amountRequested": 500000,
  "tenureMonths": 24
}

Response: {
  "loanId": "<ObjectId>",
  "message": "Loan application submitted."
}
```

#### Get Loan Status
```
GET /loans/:id/status
Authorization: Bearer <token>

Response: {
  "status": "APPROVED",
  "eligibilityScore": 0.82,
  "interestRate": 9.2,
  "amountRequested": 500000,
  "tenureMonths": 24
}
```

#### Get Customer Loans
```
GET /loans/customer/my-loans
Authorization: Bearer <token>

Response: [
  {
    "_id": "<ObjectId>",
    "amountRequested": 500000,
    "tenureMonths": 24,
    "status": "APPROVED",
    "eligibilityScore": 0.82,
    "interestRate": 9.2,
    "createdAt": "..."
  }
]
```

### Officer Endpoints

#### Get Pending Loans
```
GET /officer/loans/pending
Authorization: Bearer <token>

Response: [
  {
    "_id": "<ObjectId>",
    "customerId": {
      "userId": { "name": "...", "email": "..." }
    },
    "amountRequested": 500000,
    "tenureMonths": 24,
    "status": "PENDING",
    "eligibilityScore": 0.82
  }
]
```

#### Review Loan
```
POST /officer/loans/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "APPROVE" | "REJECT"
}

Response: {
  "message": "Loan application approved successfully",
  "loanApplication": { ... }
}
```

#### Get Officer Reviews
```
GET /officer/loans/my-reviews
Authorization: Bearer <token>

Response: [
  {
    "_id": "<ObjectId>",
    "customerId": { ... },
    "amountRequested": 500000,
    "status": "APPROVED",
    "eligibilityScore": 0.82,
    "interestRate": 9.2
  }
]
```

## Loan Eligibility Scoring Logic

The system automatically calculates eligibility scores for loan applications using the following logic:

1. **Normalize Credit Score**: Credit scores (300-850) are normalized to a 0-1 scale
2. **Normalize Income**: Annual income (up to 10,000,000) is normalized to a 0-1 scale
3. **Calculate Score**: `eligibilityScore = (0.6 * creditScoreNorm) + (0.4 * incomeNorm)`
4. **Determine Threshold**: Based on loan amount:
   - Amount > ₹1,000,000: Threshold = 0.75
   - Amount > ₹500,000: Threshold = 0.65
   - Amount > ₹200,000: Threshold = 0.55
   - Otherwise: Threshold = 0.5
5. **Auto-Status**: If `eligibilityScore >= threshold`, status is set to `APPROVED`, otherwise `REJECTED`
6. **Interest Rate**: For approved loans, interest rate is calculated as `8 + (1 - eligibilityScore) * 4` (range: 8% to 12%)

## Usage

1. **Register**: Create an account as either a Customer or Officer
2. **Login**: Login with your credentials
3. **Customer Flow**:
   - Update your profile with income and credit score
   - Apply for a loan
   - View your loan applications and their status
4. **Officer Flow**:
   - View pending loan applications
   - Review and approve/reject applications
   - View your review history

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `NODE_ENV`: Environment (development/production)

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm install -g serve
serve -s build
```

## Testing

You can test the API endpoints using tools like Postman or curl. Make sure to:
1. Register a user first
2. Login to get a JWT token
3. Use the token in the `Authorization` header for protected routes

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB is accessible on the specified port

### CORS Issues
- The backend has CORS enabled for all origins in development

### Authentication Issues
- Verify JWT_SECRET is set in `.env`
- Check token expiration (default: 7 days)
- Ensure token is included in the `Authorization` header

## Conclusion

This Loan Origination System is a complete MERN-based solution for handling:
✔ Customer loan applications
✔ Risk-based eligibility evaluation
✔ Officer approvals
✔ Secure authentication and role handling

## Author
Developed by: Shivani Nagda
Tech Stack: MERN + JWT

