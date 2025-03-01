# Parent-Teacher Collaboration Platform - Frontend 🎨

This is the frontend of the **Parent-Teacher Collaboration Platform**, built using **React, TypeScript, and Material-UI (MUI)**. It provides a user-friendly interface for parents, teachers, and administrators to collaborate effectively.

## Backend App Link
[PTCP Backend App](https://github.com/vinodjatav/ptcp-backend-app)  


## 🚀 Features

✅ **User Authentication** - Secure login with JWT authentication  
✅ **Role-Based Access Control (RBAC)** - Dynamic UI based on user roles (Admin, Teacher, Parent)  
✅ **Event Scheduling** - Manage school events with React Calendar  
✅ **Real-Time Messaging** - WebSocket-powered chat between parents and teachers  
✅ **Progress Tracking & Report Sharing** - Parents can view/download student progress reports  
✅ **File Upload & Management** - Teachers can upload assignments and reports (stored in local as of now)  
✅ **Responsive UI** - Fully optimized for desktop  

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Material-UI (MUI)
- **State Management:** React Context API
- **Real-Time Communication:** SockJS & StompJS (for WebSocket)
- **Calendar:** React Calendar (react-calendar)
- **API Calls:** Axios with JWT Authentication
- **File Handling:** Local storage

## 🔧 Setup & Installation

1️⃣ Clone the frontend repository  
```sh
git clone https://github.com/vinodjatav/ptcp-frontend-app.git
cd ptcp-frontend-app
npm i
npm start
```
2️⃣ Clone the backend repository  
```sh
git clone https://github.com/vinodjatav/ptcp-backend-app.git
cd ptcp-backend-app
# Build and run the backend application  
./mvnw clean install  
./mvnw spring-boot:run 
