# 📧 Bulk Mailer

A full-stack bulk email management application that allows administrators to securely log in, compose emails, send emails to multiple recipients, and view email history.

## 🚀 Features

- 🔐 Admin login authentication
- 📧 Send emails to multiple recipients
- 📝 Compose email with subject and message
- 📋 View email history
- ✅ Track email success and failure status
- 🗄️ Store email records in MongoDB
- 🔑 JWT-based authentication
- 📩 Send emails using Nodemailer
- 🎨 Responsive UI with Tailwind CSS

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- React Router
- Axios
- Tailwind CSS
- JavaScript (ES6+)

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Nodemailer
- dotenv
- CORS

## 📂 Project Structure


Bulkmailer/
│
├── backend/
│   ├── models/
│   │   └── Email.js         # Mongoose schema for tracking sent history/status
│   ├── .env                 # Secret environment variables (DB strings, Email App Passwords)
│   ├── .gitignore           # Ignores node_modules/ and .env during Git commits
│   ├── index.js             # Main server entry point (Express & MongoDB connection)
│   ├── package-lock.json    # Exact dependency package version locker
│   ├── package.json         # Backend scripts and project metadata manifest
│   └── vercel.json          # Deployment configuration file for hosting on Vercel
│
frontend/
├── node_modules/             # Installed project dependencies and libraries
├── public/                   # Static assets (images, icons, fonts) served directly to the browser
└── src/                      # Main source code directory for the React application
    ├── components/           # Reusable UI building blocks
    │   ├── Header.jsx        # Navigation bar or layout header component
    │   ├── History.jsx       # Component for displaying historic logs, actions, or emails
    │   ├── Login.jsx         # User authentication interface/form component
    │   └── Mailpage.jsx      # Primary dashboard view for handling and listing mails
    ├── context/              # Application-wide global state management
    │   └── Provider.jsx      # React Context Provider file (shares global data across components)
    ├── App.jsx               # Root React component managing structural layout and page routing
    ├── index.css             # Main stylesheet containing global CSS rules and design resets
    └── main.jsx              # Entry point file that boots up React and renders it inside the HTML DOM
├── .gitignore                # Tells Git which local files (like node_modules) to ignore when pushing
├── eslint.config.js          # ESLint configuration rule file for code formatting and quality checks
├── index.html                # The core single-page HTML container injected with the React bundles
├── package-lock.json         # Automatically generated exact version tracker for node modules
├── package.json              # Project manifest managing development metadata, scripts, and dependencies
├── vercel.json               # Deployment routing and override rules file tailored for Vercel hosting
└── vite.config.js            # Configuration settings for the Vite build system and dev server
│
└── README.md

📧 Send Email

Login to the application.
Open Compose Email.
Enter the recipient email address.
Enter the email subject.
Enter the email message.
Click Send Email.
The email is sent using Nodemailer.
Email details are stored in MongoDB.

📊 Email History

The Email History page displays previously sent emails.

The application stores:

Subject
Email body
Recipients
Status
Date and time

🗄️ MongoDB

The application uses MongoDB to store email history.

Default local MongoDB connection:

mongodb://127.0.0.1:27017/bulkmail

The email records are stored in the MongoDB database.

Example:

{
  "subject": "Welcome",
  "body": "Welcome to our service.",
  "recipients": [
    "example@gmail.com"
  ],
  "status": "success"
}

🔑 Authentication

JWT authentication is used to protect the application.

After successful login, the authentication token is stored in the browser and protected pages can be accessed.

Protected features include:

Compose Email
Email History

📩 Email Service

Nodemailer is used to send emails through Gmail.
For Gmail authentication, use a Google App Password instead of your normal Gmail password.

🔄 Application Flow

Login
  ↓
JWT Authentication
  ↓
Compose Email
  ↓
Node.js + Express
  ↓
Nodemailer ──────→ Gmail
  ↓
MongoDB
  ↓
Email History
🌐 API Endpoints
Login
POST /login

Authenticates the administrator.

Send Email
POST /sendmail

Sends an email and stores the email information in MongoDB.

Email History
GET /emails

Retrieves previously sent email records.

🧪 Running the Project

Terminal 1 — Backend
cd backend
node index.js
Terminal 2 — Frontend
cd frontend
npm run dev

Then open:
http://localhost:5173

🔒 Security

Keep .env private.
Never commit passwords or API keys.
Never upload Gmail App Passwords to GitHub.
Use environment variables for sensitive information.
Keep authentication secrets secure.

🌟 Future Enhancements

Email templates
CSV recipient upload
Scheduled emails
Search and filter email history
Pagination
Email analytics
Rich text email editor
Role-based authentication
