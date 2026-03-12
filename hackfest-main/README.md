# Hackathon Management System

## Project Title
**Hackathon Management System (HackFest 2026)**

---

## Project Description
The **Hackathon Management System** is a comprehensive, full-stack mobile-responsive application designed to streamline the organization and execution of hackathons. Built for admins, judges, and participants, the system provides a centralized platform for managing teams, tracking timelines, evaluating projects in real-time, and facilitating seamless communication through an integrated AI assistant. Whether it's managing complex evaluation rounds or monitoring participant complaints, this system ensures a smooth and professional hackathon experience.

---

## Key Features

### 🛠️ Admin Dashboard
- **Hackathon Configuration:** Manage hackathon dates, rounds, and statuses.
- **Judge & Team Management:** Add, update, and manage judges and participating teams.
- **Theme & Timeline Control:** Define hackathon themes and maintain a real-time event timeline.
- **Credential Generation:** Automatically generate and download login credentials for teams and judges.
- **Evaluation Monitoring:** Real-time monitoring of judge evaluations and overall leaderboard.
- **Complaint Viewer:** Track and resolve participant complaints in a centralized interface.

### ⚖️ Judge Interface
- **Team Evaluation:** Assess teams based on predefined criteria during multiple evaluation rounds.
- **Evaluation History:** Review past evaluations and track progress.
- **Real-time Leaderboard:** View live rankings of teams based on accumulated scores.

### 👥 Participant Interface
- **Personalized Dashboard:** View team details, hackathon timeline, and current round status.
- **Complaint Submission:** Submit issues or queries directly to the admin team.
- **AI ChatBot (Groot):** Get instant help and information about the hackathon via an integrated AI assistant.

### 🤖 AI Integration
- **Groot AI Assistant:** Powered by OpenAI, providing 24/7 technical and general assistance to all users.

---

## Technologies Used

### 🌐 Frontend
- **React.js (v19):** Modern component-based UI development.
- **Vite:** Next-generation frontend build tool for speed and performance.
- **Tailwind CSS:** Utility-first CSS framework for a sleek, responsive design.
- **Three.js:** Integrated 3D models (Groot) for an immersive user experience.
- **Lucide Icons:** Beautiful and consistent iconography.
- **React Router DOM:** For seamless navigation across the application.

### ⚙️ Backend
- **Node.js:** Scalable server-side JavaScript environment.
- **Express.js:** Minimal and flexible web application framework.
- **JWT (JSON Web Tokens):** Secure authentication and role-based access control.
- **Bcryptjs:** Secure password hashing for user accounts.

### 🗄️ Database
- **MongoDB:** NoSQL database for flexible and scalable data storage.
- **Mongoose:** ODM for MongoDB to manage data relationships and schemas.

### 🛠️ Development Tools
- **VS Code:** Primary IDE for development.
- **Git:** Version control system.
- **Postman:** API testing and documentation.
- **OpenAI API:** Powering the intelligent chatbot.

---

## System Requirements

### 📱 Mobile (Android)
- **Android Version:** 5.0 (Lollipop) or higher.
- **Minimum RAM:** 2GB.
- **Storage:** 50MB (for APK installation).
- **Connectivity:** Active internet connection for real-time features.

### 💻 Desktop (Admin/Judge)
- **Browser:** Google Chrome, Mozilla Firefox, or any modern web browser.
- **Internet:** Stable connection for evaluation and management.

---

## Installation and Setup Instructions

### 📦 Installation via APK
1. Download the `HackathonManagementSystem.apk` file.
2. Enable "Install from Unknown Sources" in your Android settings.
3. Open the APK file and follow the installation prompts.
4. Launch the application from your app drawer.

### 🛠️ Running from Source (Local Development)

#### 1. Prerequisites
- Install **Node.js** (v16 or higher).
- Install **MongoDB** or have a **MongoDB Atlas** connection string.

#### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# OPENAI_API_KEY=your_openai_api_key
npm run dev
```

#### 3. Frontend Setup
```bash
# In the root directory
npm install
# Ensure backend URL is correctly configured in src/api/apiClient.js
npm run dev
```

---

## How to Use the Application

1. **Login:** Use the provided credentials to log in as an **Admin**, **Judge**, or **Participant**.
2. **Admin:** 
   - Configure the hackathon settings in the "Management" tab.
   - Generate and download credentials for teams and judges.
   - Monitor the leaderboard and manage complaints.
3. **Judge:**
   - Navigate to the "Evaluate Teams" section.
   - Select a team and provide scores based on the criteria.
   - View evaluation history to track your progress.
4. **Participant:**
   - Check the timeline for upcoming events.
   - Use the **Groot AI Assistant** for any questions.
   - Submit complaints if you encounter any issues.

---

## Project Structure

```text
hackfest-main/
├── backend/                # Node.js/Express Backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # API logic handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoint definitions
│   │   └── middlewares/    # Auth and error handlers
├── src/                    # React Frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Dashboard and page views
│   ├── context/            # Global state management
│   ├── api/                # API client and service calls
│   └── assets/             # Static images and 3D models
└── public/                 # Static assets for Vite
```

---

## Screenshots
> *Insert screenshots here to showcase the professional UI.*

| Login Screen | Admin Dashboard |
| :---: | :---: |
| ![Login](https://via.placeholder.com/300x600?text=Login+Screen) | ![Admin](https://via.placeholder.com/300x600?text=Admin+Dashboard) |

| Judge Evaluation | Participant Dashboard |
| :---: | :---: |
| ![Judge](https://via.placeholder.com/300x600?text=Judge+Evaluation) | ![Participant](https://via.placeholder.com/300x600?text=Participant+Dashboard) |

---

## Future Enhancements
- **Push Notifications:** Real-time alerts for round starts and deadline reminders.
- **In-App Messaging:** Direct chat between participants and organizers.
- **Automated Plagiarism Detection:** AI-driven code analysis for project originality.
- **Offline Support:** Basic feature access during intermittent internet connectivity.

---

## Author / Developer Details
- **Name:** [Your Name]
- **College:** [Your College Name]
- **Year of Study:** [e.g., 3rd Year, B.Tech CSE]
- **Project Role:** Lead Developer / Project Manager

---
*Generated for HackFest 2026 - A Professional Hackathon Management Solution.*
