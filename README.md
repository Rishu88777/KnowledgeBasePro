🧠 Knowledge Base Platform (Confluence-like)
A full-stack collaborative documentation platform that empowers teams to create, manage, and share knowledge efficiently. Built using Spring Boot, React, and MongoDB, this solution mimics key features of Confluence with additional scope for customization and scalability.

🚀 Project Overview
This platform allows users to:

Create, edit, and organize rich text documents

Collaborate in real-time with role-based access

Search for documents using keywords

View version history and restore previous versions (optional)

Secure the platform with authentication and authorization

🔧 Tech Stack
Layer	Technology
Frontend	React, Tailwind CSS, Axios
Backend	Spring Boot (Java), Spring Security, JWT
Database	MongoDB
Build Tools	Maven (Backend), Vite or CRA (Frontend)
Dev Tools	Postman, VS Code, Docker (optional)

🛠️ Features Implemented
🔐 Role-based Authentication: Admin and User roles

📄 CRUD Operations: Create, read, update, delete documents

📁 Category/Space Structure: Group documents under a logical hierarchy

🔍 Search Functionality: Search by title/content

📦 MongoDB Integration: Efficient schema design for document and user storage

📑 Responsive UI: Clean and accessible interface

📜 RESTful APIs: Decoupled and scalable API design

⚙️ Installation
Prerequisites
Node.js & npm

Java 17+

MongoDB (local or Atlas)

Maven

Backend Setup
bash
Copy
Edit
cd backend
mvn clean install
./mvnw spring-boot:run
Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm start
MongoDB Setup
Ensure MongoDB is running locally or connect to your Atlas cluster. Configure application.properties (or application.yml) accordingly:

properties
Copy
Edit
spring.data.mongodb.uri=mongodb://localhost:27017/knowledgebase
🧪 API Endpoints (Sample)
Method	Endpoint	Description
GET	/api/docs	List all documents
POST	/api/docs	Create new document
PUT	/api/docs/{id}	Update document
DELETE	/api/docs/{id}	Delete document
GET	/api/search?q=term	Search documents
POST	/api/auth/signup	Register a user
POST	/api/auth/login	Authenticate and get token

📸 Screenshots
Add screenshots here showing your UI for login, dashboard, editor, etc.

🧠 Future Enhancements
Version control for documents

Comments and discussion threads

Real-time collaborative editing (WebSocket)

Export to PDF/Markdown

Tagging and document analytics

🤖 AI Assistance
This project was built using ChatGPT and GitHub Copilot to accelerate development, resolve bugs, and ensure best practices were followed.

📄 License
This project is open-source and free to use under the MIT License.
