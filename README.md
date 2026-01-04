# AssessX 🚀

<div align="center">

<!-- ![AssessX Logo](https://via.placeholder.com/150x150?text=AssessX)  -->
<!-- Replace with actual logo if available -->

### Modern Online Assessment Platform with Real-time Monitoring

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

</div>

---

**AssessX** is a cutting-edge assessment platform designed to provide a secure and interactive environment for online testing. Built with the MERN stack and Socket.io, it ensures real-time integrity and instant feedback.

## ✨ Key Features

- **🛡️ Secure Environment**: Real-time monitoring prevents malpractice with Tab-Switch detection and Fullscreen enforcement.
- **⚡ Real-time Updates**: Instant result calculation and status tracking via Socket.io.
- **👁️ AI Proctoring**: (Beta) Client-side eye tracking and webcam monitoring.
- **👨‍🏫 Admin Dashboard**: Comprehensive control to create, edit, and manage tests.
- **👨‍🎓 Student Portal**: Intuitive interface for taking exams with timer and progress saving.
- **📊 Visual Analytics**: Beautiful charts and graphs for result analysis.
- **🎨 Modern UI**: Built with TailwindCSS, Framer Motion, and GSAP. Features **Dark/Light Mode** and glassmorphism design.

## 🛠️ Technology Stack

| Component | Tech |
|-----------|------|
| **Frontend** | React 19, Vite, TailwindCSS, Framer Motion, GSAP, Three.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Real-time** | Socket.io |
| **Authentication** | JWT (JSON Web Tokens) |

## 📸 Screenshots

### 🏠 Landing Page (New Redesign)
![Landing Page](assets/landing_page_new.png)

### 🔐 Student Login
![Student Login](docs/student_login.png)

### 👨‍💻 Admin Login
![Admin Login](docs/admin_login.png)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URL)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/04shubham7/AssessX.git
    cd AssessX
    ```

2.  **Install Server Dependencies**
    ```bash
    npm install
    ```

3.  **Install Client Dependencies**
    ```bash
    cd client
    npm install
    cd ..
    ```

4.  **Environment Setup**
    - Create a `.env` file in the `server` directory:
      ```env
      PORT=5000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_secret_key
      ```

5.  **Run the Application**
     Open two terminals:
    
    *Terminal 1 (Server):*
    ```bash
    npm run start
    ```
    
    *Terminal 2 (Client):*
    ```bash
    cd client
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
