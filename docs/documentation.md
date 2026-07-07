# SMART FYP MANAGEMENT SYSTEM

## Final Year Project Documentation

### Bachelor of Science in Software Engineering

---

**Prepared By:**
[Your Name]
[Registration Number]

**Supervised By:**
[Supervisor Name]
[Designation]

**Department of Computer Science**
**University Name**
**2026**

---

# CERTIFICATE

This is to certify that the project titled **"Smart FYP Management System"** submitted by **[Name]** ([Registration No.]) in partial fulfillment of the requirements for the degree of Bachelor of Science in Software Engineering, is a record of original work carried out under my supervision and is worthy of presentation.

---

**Supervisor**

Name: ___________________
Designation: ___________________
Date: ___________________

---

**External Examiner**

Name: ___________________
Date: ___________________

---

**Head of Department**

Name: ___________________
Date: ___________________

---

# ACKNOWLEDGEMENTS

First and foremost, all praise and gratitude to Allah Almighty for granting the knowledge, strength, and perseverance to complete this project.

We would like to express sincere gratitude to our supervisor, **[Supervisor Name]**, for their invaluable guidance, continuous support, and constructive feedback throughout the development of this project. Their expertise and mentorship were instrumental in shaping this work.

We extend our appreciation to the **Department of Computer Science** for providing the resources and environment conducive to learning and innovation.

Special thanks to all faculty members who imparted knowledge during the coursework, laying the foundation that made this project possible.

We are grateful to our families and friends for their unwavering encouragement, patience, and moral support throughout this academic journey.

Finally, we thank all the students and faculty who participated in testing and provided feedback that helped refine the system.

---

# ABSTRACT

The Smart FYP Management System is a comprehensive web-based platform designed to streamline the management of Final Year Projects (FYP) in higher education institutions. Traditional FYP management relies heavily on manual processes, paper-based documentation, email communication, and fragmented digital tools, leading to inefficiencies in project tracking, communication gaps, delayed feedback, and poor progress monitoring.

This system addresses these challenges by providing a centralized, role-based platform with three distinct user roles: **Student**, **Supervisor**, and **Administrator**. Students can submit project proposals, track tasks and milestones, upload weekly progress reports, communicate via real-time chat, and receive feedback. Supervisors can manage assigned projects, evaluate reports, schedule meetings, assign tasks, and monitor student progress through analytics dashboards. Administrators have overarching control to manage users, departments, generate system-wide reports, and oversee all projects.

The system is built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with **Socket.io** for real-time communication, **Tailwind CSS** for responsive UI design, **JWT** for secure authentication, and **Multer** for file uploads. The frontend employs **React Router** for navigation, **React Context API** for state management, and **Vite** for optimized builds with code splitting for performance.

Key features include real-time messaging with typing indicators and file sharing, milestone-based progress tracking, automated deadline alerts, dynamic dashboard analytics, role-based access control, password reset via email, and comprehensive report generation. The system achieves a production build with 176 modules, 41 code-split chunks, and a main bundle of only 99 KB (gzip).

Testing was conducted at unit, integration, and system levels, validating all 35+ API endpoints, real-time socket events, responsive UI components, and security mechanisms. The resulting system is production-ready, scalable, and deployable.

---

# TABLE OF CONTENTS

| Section | Title |
|---------|-------|
| 1 | Introduction |
| 2 | Problem Statement |
| 3 | Objectives |
| 4 | Scope of the Project |
| 5 | Literature Review |
| 6 | System Analysis |
| 7 | Functional Requirements |
| 8 | Non-Functional Requirements |
| 9 | System Architecture |
| 10 | ER Diagram |
| 11 | Database Schema |
| 12 | Data Dictionary |
| 13 | Use Case Diagram |
| 14 | Use Case Descriptions |
| 15 | Class Diagram |
| 16 | Sequence Diagrams |
| 17 | Activity Diagrams |
| 18 | DFD (Level 0, 1, 2) |
| 19 | Flowcharts |
| 20 | UI/UX Design |
| 21 | Technology Stack |
| 22 | Database Design |
| 23 | API Documentation |
| 24 | Authentication & Authorization Flow |
| 25 | Module Descriptions |
| 26 | Chat Module Workflow |
| 27 | Progress Report Workflow |
| 28 | Testing |
| 29 | Test Cases and Results |
| 30 | Validation and Error Handling |
| 31 | Security Features |
| 32 | Performance Optimization |
| 33 | Challenges Faced |
| 34 | Future Enhancements |
| 35 | Conclusion |
| 36 | References |
| 37 | Appendices |

---

# 1. INTRODUCTION

## 1.1 Background

Final Year Projects (FYP) are a critical component of undergraduate software engineering and computer science programs. They serve as the capstone experience where students demonstrate their ability to apply theoretical knowledge to practical, real-world problems. However, the management of FYPs presents significant challenges for both students and faculty. Traditional methods involving spreadsheets, email correspondence, physical document submissions, and manual tracking are error-prone, time-consuming, and lack transparency.

## 1.2 Overview of the System

The **Smart FYP Management System** is a web-based application that digitizes and automates the entire FYP lifecycle. It provides a unified platform where:

- **Students** can register, create project proposals, submit weekly reports, track tasks and milestones, communicate with supervisors via real-time chat, schedule meetings, and monitor their progress through visual dashboards.

- **Supervisors** can manage multiple projects, assign and track tasks, evaluate reports, provide feedback, schedule meetings, view analytics dashboards, and communicate with students.

- **Administrators** have system-wide oversight including user management, department management, project approval workflow, announcement broadcasting, system-wide report generation, and configuration settings.

The system employs modern web technologies to deliver a responsive, secure, and scalable solution. Real-time features are powered by WebSockets (Socket.io), enabling instant messaging, typing indicators, and live notifications. The user interface is built with React and Tailwind CSS, providing a clean, modern experience across desktop and mobile devices.

## 1.3 Purpose of the Document

This document serves as the complete project report for the Smart FYP Management System. It details the problem domain, system requirements, architectural design, implementation details, testing methodology, and outcomes. The document is structured to meet the requirements of a BS Software Engineering Final Year Project report.

---

# 2. PROBLEM STATEMENT

Final Year Project management in universities faces several critical challenges:

## 2.1 Current Issues

1. **Manual and Fragmented Processes**: Most institutions rely on a combination of email, physical documents, spreadsheets, and ad-hoc tools for FYP management. This fragmentation leads to misplaced documents, lost communications, and inconsistent record-keeping.

2. **Lack of Centralized Platform**: There is no single source of truth for project status, deadlines, feedback, or communications. Students and supervisors often have different understandings of project progress.

3. **Communication Gaps**: Email-based communication is asynchronous and lacks immediacy. Important updates, feedback, and queries experience delays, reducing the pace of project development.

4. **Poor Progress Tracking**: Without automated tracking mechanisms, supervisors struggle to monitor student progress between scheduled meetings. Students lack visibility into their own progress against milestones.

5. **Inefficient Report Management**: Report submission, review, and feedback cycles are slow when conducted through email attachments. Version control issues arise, and feedback can be lost.

6. **Delayed Deadline Awareness**: Students often miss deadlines due to the lack of automated reminders and alerts. Supervisors are unaware of approaching deadlines across their multiple supervisees.

7. **Limited Oversight for Administration**: Administrators lack tools to monitor overall FYP progress, generate statistics, identify bottlenecks, or produce institutional reports.

## 2.2 Consequences

These problems result in:
- Reduced quality of final year projects
- Increased administrative burden on faculty
- Student dissatisfaction due to poor communication
- Missed deadlines and incomplete project phases
- Difficulty in maintaining historical records
- Inefficient resource allocation

---

# 3. OBJECTIVES

## 3.1 General Objective

To design, develop, and deploy a comprehensive web-based Smart FYP Management System that digitizes and streamlines the entire Final Year Project lifecycle, improving efficiency, communication, and transparency for all stakeholders.

## 3.2 Specific Objectives

1. **Develop a Role-Based Access System**: Implement secure authentication with three distinct roles (Student, Supervisor, Admin) with role-specific dashboards and permissions.

2. **Create Project Management Workflow**: Enable students to submit project proposals, supervisors to approve/reject, and administrators to oversee the entire lifecycle from proposal to completion.

3. **Implement Real-Time Communication**: Build a real-time chat module with message delivery status, typing indicators, file sharing, and online/offline presence.

4. **Build Progress Tracking System**: Implement milestone-based tracking, task assignment and completion, weekly report submissions, and visual progress indicators.

5. **Develop Reporting and Analytics**: Create dynamic dashboards with statistics, charts, and generate system-wide reports for administrators.

6. **Implement Deadline Management**: Build automated deadline checking with real-time alerts for overdue tasks, approaching deadlines, and milestone dates.

7. **Ensure Security and Data Protection**: Implement JWT-based authentication, password hashing, role-based authorization, input validation, and secure file handling.

8. **Optimize for Performance**: Implement code splitting, lazy loading, and efficient database queries to ensure fast load times and smooth user experience.

9. **Test System Comprehensively**: Conduct unit, integration, and system testing to ensure reliability, security, and correctness.

---

# 4. SCOPE OF THE PROJECT

## 4.1 In Scope

### Functional Scope:
- User registration and login with role selection
- Project proposal creation, submission, approval, and management
- Task creation, assignment, and tracking with status updates
- Meeting scheduling with attendee management
- Report submission (progress, final, evaluation) with file uploads
- Real-time messaging with file sharing
- Weekly report submissions with work tracking
- Milestone planning and progress tracking
- Notification system for events and deadlines
- Department management (CRUD operations)
- Announcement broadcasting with role targeting
- Calendar view for meetings and deadlines
- Admin dashboard with system-wide statistics
- Report generation (projects, students, supervisors, tasks, meetings, submissions, summary)
- Password reset via email
- Dark mode / light mode theme toggle
- Deadline alerts with dismissal capability
- File uploads with type and size validation

### User Scope:
- Students: project management, task viewing, report submission, chat, meeting scheduling
- Supervisors: project oversight, task management, report evaluation, student communication
- Administrators: full system management, user administration, report generation

## 4.2 Out of Scope

- Mobile native applications (iOS/Android)
- Integration with university learning management systems (LMS)
- AI/ML-based plagiarism detection
- Online payment processing
- Video conferencing (meeting links are provided separately)
- Automated grading or evaluation
- Student peer evaluation system

---

# 5. LITERATURE REVIEW

## 5.1 Existing FYP Management Systems

Several academic and commercial systems exist for managing final year projects:

**FYPMS (Final Year Project Management System)** is a web-based system that allows students to submit project titles and supervisors to approve them. It provides basic tracking but lacks real-time communication, progress tracking, and comprehensive analytics.

**Project Tracking Systems** like Redmine and Jira are designed for software development teams rather than academic project management. They lack role-specific features needed in educational contexts, such as supervisor-student hierarchies, report evaluation workflows, and semester-based project cycles.

**University-Specific Solutions**: Many universities have developed in-house solutions using technologies like PHP/MySQL. These are often outdated, lack modern UI/UX standards, and suffer from security vulnerabilities.

## 5.2 Technology Review

**MERN Stack**: MongoDB, Express.js, React, and Node.js form a full-stack JavaScript framework that enables rapid development. MongoDB provides flexible document-based storage ideal for semi-structured data like project proposals and reports. React offers component-based UI development with efficient rendering through the virtual DOM. Node.js provides non-blocking I/O suitable for real-time applications.

**WebSockets and Socket.io**: For real-time bidirectional communication, WebSockets provide persistent connections between client and server. Socket.io adds reliability features like auto-reconnection, fallback transports, and room-based broadcasting, making it ideal for chat and notification systems.

**JWT (JSON Web Tokens)**: Stateless authentication using JWTs allows the system to scale without server-side session storage. Tokens encode user identity and role, enabling efficient authorization checks.

**Tailwind CSS**: A utility-first CSS framework that enables rapid UI development with consistent design language, responsive layouts, and dark mode support.

## 5.3 Gap Analysis

Existing solutions reviewed in the literature lack one or more of the following features that our system addresses:

1. Real-time messaging integrated into the project management workflow
2. Milestone-based progress tracking with visual dashboards
3. Automated deadline alerts with real-time push notifications
4. Role-specific analytics dashboards for all three user types
5. Code splitting and lazy loading for optimal performance
6. Dark mode support for enhanced user experience
7. Comprehensive API for extensibility and integration

---

# 6. SYSTEM ANALYSIS

## 6.1 Feasibility Study

### 6.1.1 Technical Feasibility
The system is built using well-established, mature technologies. MongoDB, Express.js, React, and Node.js have large communities, extensive documentation, and proven track records. Socket.io is the industry standard for real-time web applications. All technologies are open-source with no licensing costs.

### 6.1.2 Operational Feasibility
The system is designed for non-technical users. The intuitive UI with role-specific dashboards reduces the learning curve. Real-time features enhance collaboration. The system automates manual processes, reducing administrative burden.

### 6.1.3 Economic Feasibility
The system uses free and open-source technologies. Hosting can be done on affordable cloud platforms (e.g., AWS EC2, DigitalOcean, Vercel + MongoDB Atlas). No proprietary software licenses are required.

## 6.2 Requirements Gathering

Requirements were gathered through:
- Interviews with faculty members who supervise FYPs
- Surveys of students who recently completed FYPs
- Analysis of existing manual FYP management processes
- Review of academic literature on project management systems
- Study of existing commercial and academic FYP management tools

## 6.3 System Requirements

### Hardware Requirements

**Server:**
- CPU: 2+ cores, 2.0 GHz or higher
- RAM: 4 GB minimum (8 GB recommended)
- Storage: 20 GB SSD minimum
- Network: Broadband internet connection

**Client:**
- Modern web browser (Chrome 90+, Firefox 90+, Edge 90+, Safari 14+)
- RAM: 4 GB minimum
- Screen resolution: 1024x768 or higher
- Internet connection: Broadband

### Software Requirements

**Server:**
- Node.js 18.x or higher
- MongoDB 6.x or higher
- npm 9.x or higher

**Client:**
- Any modern web browser
- JavaScript enabled

---

# 7. FUNCTIONAL REQUIREMENTS

## 7.1 Authentication Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | System shall allow users to register with name, email, password, role, and department | High |
| FR-02 | System shall allow users to log in with email, password, and role selection | High |
| FR-03 | System shall validate user credentials against the database | High |
| FR-04 | System shall verify that the selected role matches the user's database role | High |
| FR-05 | System shall prevent admin self-registration | High |
| FR-06 | System shall provide password reset via email with time-limited tokens | Medium |
| FR-07 | System shall support "Remember Me" functionality | Low |
| FR-08 | System shall allow profile updates (name, phone, avatar, etc.) | Medium |

## 7.2 Student Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-09 | System shall allow students to create new project proposals | High |
| FR-10 | System shall allow students to view their projects with details | High |
| FR-11 | System shall allow students to edit their project proposals | Medium |
| FR-12 | System shall allow students to request a supervisor | High |
| FR-13 | System shall display student's assigned tasks with status | High |
| FR-14 | System shall display student's meetings | Medium |
| FR-15 | System shall allow students to submit reports with file uploads | High |
| FR-16 | System shall allow students to submit weekly reports with work details | High |
| FR-17 | System shall track milestones and display progress visually | High |
| FR-18 | System shall provide a dashboard with project stats, tasks, and meetings | High |

## 7.3 Supervisor Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-19 | System shall display the supervisor's dashboard with assigned projects | High |
| FR-20 | System shall allow supervisors to view and manage assigned projects | High |
| FR-21 | System shall allow supervisors to approve or reject project proposals | High |
| FR-22 | System shall allow supervisors to provide feedback on projects | Medium |
| FR-23 | System shall allow supervisors to create and assign tasks to students | High |
| FR-24 | System shall allow supervisors to schedule meetings with attendees | High |
| FR-25 | System shall allow supervisors to view and evaluate student reports | High |
| FR-26 | System shall allow supervisors to view student weekly reports | Medium |
| FR-27 | System shall allow supervisors to manage milestones | High |
| FR-28 | System shall provide a calendar view of meetings | Medium |

## 7.4 Admin Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-29 | System shall provide an admin dashboard with system-wide statistics | High |
| FR-30 | System shall allow admins to manage all users (CRUD) | High |
| FR-31 | System shall allow admins to view and manage all projects | High |
| FR-32 | System shall allow admins to assign supervisors to projects | High |
| FR-33 | System shall allow admins to manage departments (CRUD) | Medium |
| FR-34 | System shall allow admins to create and manage announcements | Medium |
| FR-35 | System shall allow admins to view all reports with filtering | Medium |
| FR-36 | System shall allow admins to generate system reports (JSON) | Medium |
| FR-37 | System shall allow admins to view all messages | Low |
| FR-38 | System shall allow admins to configure system settings | Low |

## 7.5 Real-Time Communication

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-39 | System shall provide real-time chat with Socket.io | High |
| FR-40 | System shall display online/offline user status | Medium |
| FR-41 | System shall provide typing indicators | Medium |
| FR-42 | System shall support file sharing in chat | Medium |
| FR-43 | System shall provide message delivery status | Medium |
| FR-44 | System shall allow creating new conversations by project | Medium |
| FR-45 | System shall provide real-time notifications for new messages | Medium |

## 7.6 Notification and Alerts

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-46 | System shall create notifications for task assignments | High |
| FR-47 | System shall create notifications for project approvals/rejections | High |
| FR-48 | System shall create notifications for meeting scheduling | Medium |
| FR-49 | System shall create notifications for report submissions and reviews | Medium |
| FR-50 | System shall provide deadline alerts for overdue and due-soon tasks | High |
| FR-51 | System shall provide milestone deadline alerts | High |
| FR-52 | System shall allow dismissing individual alerts | Low |

---

# 8. NON-FUNCTIONAL REQUIREMENTS

## 8.1 Performance

| ID | Requirement |
|----|-------------|
| NFR-01 | Page load time shall be under 3 seconds for initial load |
| NFR-02 | Chat messages shall be delivered in under 500ms |
| NFR-03 | The system shall handle at least 100 concurrent users |
| NFR-04 | API response time shall be under 500ms for 95% of requests |
| NFR-05 | Database queries shall be optimized with proper indexing |
| NFR-06 | Frontend bundle size shall be under 150 KB (gzip) for initial load |

## 8.2 Security

| ID | Requirement |
|----|-------------|
| NFR-07 | Passwords shall be hashed using bcrypt with salt rounds of 10 |
| NFR-08 | Authentication shall use JWT tokens with configurable expiry |
| NFR-09 | API endpoints shall be protected with role-based authorization |
| NFR-10 | File uploads shall be validated for type and size (max 10 MB) |
| NFR-11 | Input data shall be sanitized to prevent injection attacks |
| NFR-12 | 401 responses shall clear local state and redirect to login |

## 8.3 Usability

| ID | Requirement |
|----|-------------|
| NFR-13 | The UI shall be responsive across desktop, tablet, and mobile devices |
| NFR-14 | The system shall support dark mode and light mode themes |
| NFR-15 | Loading states shall be indicated with spinners and skeleton screens |
| NFR-16 | Error messages shall be user-friendly and descriptive |
| NFR-17 | Navigation shall be consistent across all pages |

## 8.4 Reliability

| ID | Requirement |
|----|-------------|
| NFR-18 | Data shall persist in MongoDB with regular backup capability |
| NFR-19 | Socket connections shall auto-reconnect on disconnect |
| NFR-20 | Form data shall be validated both client-side and server-side |

## 8.5 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-21 | Code shall follow modular architecture with separation of concerns |
| NFR-22 | Configuration shall be managed through environment variables |
| NFR-23 | Code shall be well-structured with consistent naming conventions |

---

# 9. SYSTEM ARCHITECTURE

## 9.1 Overall Architecture

The Smart FYP Management System follows a **three-tier client-server architecture** with a **RESTful API** backend and **WebSocket** support for real-time features.

```
+------------------------------------------------------------------+
|                     CLIENT TIER (React SPA)                       |
|  +-------------+  +-------------+  +---------------------------+  |
|  | Auth Pages  |  | Dashboard   |  | Shared Components         |  |
|  | (Login,Reg) |  | (Student/   |  | (Navbar, Sidebar, Chat,   |  |
|  |             |  |  Supervisor |  |  DeadlineAlerts, etc.)    |  |
|  |             |  |  /Admin)    |  |                           |  |
|  +------+------+  +------+------+  +-------------+-------------+  |
|         |                |                       |                |
|         +----------------+-----------------------+                |
|                          |                                        |
|              +-----------+-----------+                            |
|              |  Context Providers   |                             |
|              | (Auth, Socket, Theme)|                             |
|              +---------------------+                              |
+------------------------------------------------------------------+
         |                              |
         v                              v
+------------------------------------------------------------------+
|                     API GATEWAY (Vite Proxy)                       |
|              /api/*  --->  http://localhost:5000/api/*             |
|              /socket.io  --->  ws://localhost:5000                 |
+------------------------------------------------------------------+
         |                              |
         v                              v
+------------------------------------------------------------------+
|                     SERVER TIER (Node.js + Express)                |
|  +-------------+  +-------------+  +---------------------------+  |
|  | REST Routes |  | Socket.io   |  | Middleware                |  |
|  | (17 modules)|  | Server      |  | (Auth, Upload, Error)    |  |
|  +------+------+  +------+------+  +-------------+-------------+  |
|         |                |                       |                |
|         v                v                       v                |
|  +-----------------------------------------------------------+   |
|  |                   Controllers Layer                         |   |
|  |   (Auth, Project, Task, Meeting, Report, Chat, etc.)       |   |
|  +-----------------------------------------------------------+   |
|         |                                                        |
|         v                                                        |
|  +-----------------------------------------------------------+   |
|  |                   Models Layer (Mongoose)                    |   |
|  |   (User, Project, Task, Meeting, Message, Report, etc.)    |   |
|  +-----------------------------------------------------------+   |
+------------------------------------------------------------------+
         |
         v
+------------------------------------------------------------------+
|                     DATABASE TIER (MongoDB)                       |
|  Collections: users, projects, tasks, meetings, messages,        |
|  reports, notifications, conversations, milestones,              |
|  weeklyreports, departments, announcements, activitylogs         |
+------------------------------------------------------------------+
```

## 9.2 Architecture Components

### 9.2.1 Frontend (Client Tier)
- **Single Page Application (SPA)** built with React 18
- **Vite** for development server and production builds
- **React Router v6** for client-side routing with lazy loading
- **Context API** for global state management (Auth, Socket, Theme)
- **Axios** for HTTP communication with interceptors
- **Socket.io-client** for real-time bidirectional communication
- **Tailwind CSS** for utility-first responsive styling
- **React Icons** for iconography
- **React Hot Toast** for notification toasts
- **Recharts / Chart.js** for data visualization

### 9.2.2 Backend (Server Tier)
- **Node.js** with **Express.js** framework
- **Mongoose ODM** for MongoDB object modeling
- **JWT (jsonwebtoken)** for stateless authentication
- **bcryptjs** for password hashing
- **Multer** for file upload handling
- **Socket.io** for WebSocket-based real-time features
- **Nodemailer** for email services

### 9.2.3 Database (Data Tier)
- **MongoDB** (NoSQL document database)
- 13 collections: User, Project, Task, Meeting, Report, Message, Conversation, Notification, Milestone, WeeklyReport, Department, Announcement, ActivityLog

## 9.3 Data Flow

User Request (Browser) -> React Router -> ProtectedRoute -> Lazy-loaded Page -> API Service (Axios) -> Vite Proxy -> Express Server -> Middleware Chain (CORS, JSON, Auth, Role) -> Controller -> MongoDB (via Mongoose) -> JSON Response -> Client State Update

For real-time features:
Client A -> socket.emit('sendMessage') -> Socket.io Server -> Message.create() (MongoDB) -> Conversation.findByIdAndUpdate() -> socket.broadcast.to(room).emit('newMessage') -> Client B receives real-time message

---

# 10. ENTITY RELATIONSHIP DIAGRAM (ERD)

The Entity Relationship Diagram for the Smart FYP Management System:

```
+----------------+          +------------------+          +----------------+
|     User       |          |     Project      |          |     Task       |
+----------------+          +------------------+          +----------------+
| PK: _id        |<-------->| PK: _id          |<-------->| PK: _id        |
| name           | 1    N   | title            | 1    N   | title          |
| email          |          | description      |          | description    |
| password       |          | technologies[]   |          | status         |
| role           |          | status           |          | priority       |
| department     |          | progress         |          | dueDate        |
| regNo          |          | semester         |          | completedAt    |
| designation    |          | documents[]      |          |----------------|
| phone          |          | feedbacks[]      |          | FK: project    |
| avatar         |          |------------------|          | FK: assignedTo |
| isActive       |          | FK: supervisor   |          | FK: assignedBy |
+----------------+          | FK: teamMembers[]|          +----------------+
        |                   +------------------+
        | 1                        |
        |                          | 1
        v                          v
+----------------+          +------------------+
|   Message      |          |   Conversation   |
+----------------+          +------------------+
| PK: _id        |<-------->| PK: _id          |
| content        | N    1   |------------------|
| fileUrl        |          | FK: participants |
| fileName       |          | FK: project      |
| fileSize       |          | FK: lastMessage  |
| isRead         |          +------------------+
|----------------|
| FK: conversation|
| FK: sender     |
+----------------+

+----------------+          +------------------+
|   Meeting      |          |   Milestone      |
+----------------+          +------------------+
| PK: _id        |          | PK: _id          |
| title          |          | title            |
| date           |          | description      |
| duration       |          | dueDate          |
| notes          |          | completedAt      |
| link           |          | status           |
| status         |          | order            |
|----------------|          |------------------|
| FK: project    |          | FK: project      |
| FK: createdBy  |          +------------------+
| FK: attendees[]|
+----------------+

+----------------+          +------------------+
|   Report       |          | WeeklyReport     |
+----------------+          +------------------+
| PK: _id        |          | PK: _id          |
| title          |          | weekNumber       |
| type           |          | startDate        |
| fileUrl        |          | endDate          |
| origFileName   |          | workDone         |
| fileSize       |          | workPlanned      |
| submissionDate |          | challenges       |
| status         |          | hoursSpent       |
| feedback       |          | status           |
|----------------|          | feedback         |
| FK: project    |          |------------------|
| FK: evaluatedBy|          | FK: project      |
+----------------+          | FK: student      |
                            +------------------+

+----------------+          +------------------+
| Notification   |          |   Department     |
+----------------+          +------------------+
| PK: _id        |          | PK: _id          |
| title          |          | name             |
| message        |          | code             |
| type           |          | description      |
| link           |          | isActive         |
| isRead         |          |------------------|
|----------------|          | FK: head         |
| FK: user       |          +------------------+
+----------------+

+----------------+          +------------------+
| Announcement   |          |  ActivityLog     |
+----------------+          +------------------+
| PK: _id        |          | PK: _id          |
| title          |          | action           |
| content        |          | description      |
| targetRole     |          | resource         |
| isActive       |          | resourceId       |
|----------------|          |------------------|
| FK: createdBy  |          | FK: user         |
+----------------+          +------------------+
```

**Relationships:**
1. User - Project (1:N): A user can be on multiple projects as team member or supervisor
2. User - Task (1:N): A user can be assigned multiple tasks or assign tasks
3. User - Message (1:N): A user can send multiple messages
4. User - Meeting (1:N): A user can create or attend multiple meetings
5. User - Notification (1:N): A user receives multiple notifications
6. User - WeeklyReport (1:N): A student submits multiple weekly reports
7. User - ActivityLog (1:N): A user generates multiple activity logs
8. Project - Task (1:N): A project contains multiple tasks
9. Project - Meeting (1:N): A project can have multiple meetings
10. Project - Milestone (1:N): A project has multiple milestones
11. Project - Report (1:N): A project has multiple reports
12. Project - WeeklyReport (1:N): A project has multiple weekly reports
13. Project - Conversation (1:N): A project can have one conversation
14. Conversation - Message (1:N): A conversation contains multiple messages

---

# 11. DATABASE SCHEMA

The database schema is implemented using MongoDB with Mongoose ODM.

## Collection: users
```
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  password: String (required, minlength: 6, select: false),
  role: String (enum: ['student', 'supervisor', 'admin'], default: 'student'),
  department: String (trimmed),
  regNo: String (trimmed),
  designation: String (trimmed),
  phone: String (trimmed),
  avatar: String (default: ''),
  isActive: Boolean (default: true),
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  timestamps: { createdAt, updatedAt }
}
```
Pre-save hook: hashes password with bcrypt (salt rounds: 10)
Methods: matchPassword(), generateToken()

## Collection: projects
```
{
  _id: ObjectId,
  title: String (required, trimmed),
  description: String (required),
  technologies: [String],
  teamMembers: [{ type: ObjectId, ref: 'User' }],
  supervisor: { type: ObjectId, ref: 'User' },
  status: String (enum: ['pending','approved','rejected','in_progress','completed','archived'], default: 'pending'),
  progress: Number (default: 0, min: 0, max: 100),
  documents: [{ name: String, url: String, type: String, uploadedAt: Date }],
  feedbacks: [{ comment: String, by: { type: ObjectId, ref: 'User' }, date: Date }],
  semester: String,
  timestamps: { createdAt, updatedAt }
}
```

## Collection: tasks
```
{
  _id: ObjectId,
  title: String (required, trimmed),
  description: String,
  project: { type: ObjectId, ref: 'Project', required: true },
  assignedTo: { type: ObjectId, ref: 'User' },
  assignedBy: { type: ObjectId, ref: 'User' },
  status: String (enum: ['pending','in_progress','completed','overdue'], default: 'pending'),
  priority: String (enum: ['low','medium','high'], default: 'medium'),
  dueDate: Date,
  completedAt: Date,
  timestamps: { createdAt, updatedAt }
}
```

## Collection: meetings
```
{
  _id: ObjectId,
  project: { type: ObjectId, ref: 'Project', required: true },
  title: String (required),
  date: Date (required),
  duration: Number (default: 30),
  notes: String,
  link: String,
  createdBy: { type: ObjectId, ref: 'User' },
  attendees: [{ type: ObjectId, ref: 'User' }],
  status: String (enum: ['scheduled','completed','cancelled'], default: 'scheduled'),
  timestamps: { createdAt, updatedAt }
}
```

## Collection: reports
```
{
  _id: ObjectId,
  project: { type: ObjectId, ref: 'Project', required: true },
  title: String (required),
  type: String (enum: ['progress','final','evaluation'], default: 'progress'),
  fileUrl: String,
  origFileName: String,
  fileSize: Number,
  submissionDate: Date (default: Date.now),
  status: String (enum: ['submitted','reviewed','approved','rejected'], default: 'submitted'),
  feedback: String,
  evaluatedBy: { type: ObjectId, ref: 'User' },
  timestamps: { createdAt, updatedAt }
}
```

## Collection: messages
```
{
  _id: ObjectId,
  conversation: { type: ObjectId, ref: 'Conversation' },
  sender: { type: ObjectId, ref: 'User' },
  content: String (default: ''),
  fileUrl: String (default: ''),
  fileName: String (default: ''),
  fileSize: Number (default: 0),
  isRead: Boolean (default: false),
  timestamps: { createdAt, updatedAt }
}
```

## Collection: conversations
```
{
  _id: ObjectId,
  participants: [{ type: ObjectId, ref: 'User' }],
  project: { type: ObjectId, ref: 'Project' },
  lastMessage: { type: ObjectId, ref: 'Message' },
  timestamps: { createdAt, updatedAt }
}
```

## Collection: milestones
```
{
  _id: ObjectId,
  project: { type: ObjectId, ref: 'Project', required: true },
  title: String (required, trimmed),
  description: String,
  dueDate: Date,
  completedAt: Date,
  status: String (enum: ['pending','in_progress','completed','overdue'], default: 'pending'),
  order: Number (default: 0),
  timestamps: { createdAt, updatedAt }
}
```

## Collection: weeklyreports
```
{
  _id: ObjectId,
  project: { type: ObjectId, ref: 'Project', required: true },
  student: { type: ObjectId, ref: 'User', required: true },
  weekNumber: Number (required),
  startDate: Date,
  endDate: Date,
  workDone: String,
  workPlanned: String,
  challenges: String,
  hoursSpent: Number (default: 0),
  status: String (enum: ['draft','submitted','reviewed'], default: 'draft'),
  feedback: String,
  timestamps: { createdAt, updatedAt }
}
```

## Collection: notifications
```
{
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User' },
  title: String (required),
  message: String (required),
  type: String (enum: ['info','success','warning','error'], default: 'info'),
  link: String,
  isRead: Boolean (default: false),
  timestamps: { createdAt, updatedAt }
}
```

## Collection: departments
```
{
  _id: ObjectId,
  name: String (required, unique, trimmed),
  code: String (required, unique, trimmed),
  head: { type: ObjectId, ref: 'User' },
  description: String (trimmed),
  isActive: Boolean (default: true),
  timestamps: { createdAt, updatedAt }
}
```

## Collection: announcements
```
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  createdBy: { type: ObjectId, ref: 'User' },
  targetRole: String (enum: ['all','student','supervisor','admin'], default: 'all'),
  isActive: Boolean (default: true),
  timestamps: { createdAt, updatedAt }
}
```

## Collection: activitylogs
```
{
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User' },
  action: String (required),
  description: String,
  resource: String,
  resourceId: ObjectId,
  timestamps: { createdAt, updatedAt }
}
```

---

# 12. DATA DICTIONARY

## User Model Fields

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| _id | ObjectId | Yes | Yes | Auto | Unique identifier |
| name | String | Yes | No | - | Full name of the user |
| email | String | Yes | Yes | - | Email address (lowercase) |
| password | String | Yes | No | - | Hashed password (select: false) |
| role | String | No | No | 'student' | User role (student/supervisor/admin) |
| department | String | No | No | - | Department name |
| regNo | String | No | No | - | Registration number (students) |
| designation | String | No | No | - | Job title (supervisors) |
| phone | String | No | No | - | Contact number |
| avatar | String | No | No | '' | Avatar URL |
| isActive | Boolean | No | No | true | Account active status |
| resetPasswordToken | String | No | No | - | Password reset token |
| resetPasswordExpire | Date | No | No | - | Token expiration time |

## Project Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique identifier |
| title | String | Yes | Project title |
| description | String | Yes | Project description |
| technologies | [String] | No | Technology stack used |
| teamMembers | [ObjectId] | No | References to User (students) |
| supervisor | ObjectId | No | Reference to User (supervisor) |
| status | String | No | pending/approved/rejected/in_progress/completed/archived |
| progress | Number | No | 0-100 percentage |
| documents | [Object] | No | Uploaded documents array |
| feedbacks | [Object] | No | Supervisor feedback array |
| semester | String | No | Academic semester |

## Task Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique identifier |
| title | String | Yes | Task title |
| description | String | No | Task description |
| project | ObjectId | Yes | Reference to Project |
| assignedTo | ObjectId | No | Reference to User (student) |
| assignedBy | ObjectId | No | Reference to User (supervisor) |
| status | String | No | pending/in_progress/completed/overdue |
| priority | String | No | low/medium/high |
| dueDate | Date | No | Task deadline |
| completedAt | Date | No | Actual completion date |

## Meeting Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique identifier |
| project | ObjectId | Yes | Reference to Project |
| title | String | Yes | Meeting title |
| date | Date | Yes | Meeting date/time |
| duration | Number | No | Duration in minutes (default: 30) |
| notes | String | No | Meeting notes |
| link | String | No | Online meeting link |
| createdBy | ObjectId | No | Reference to User (creator) |
| attendees | [ObjectId] | No | References to User (attendees) |
| status | String | No | scheduled/completed/cancelled |

## Report Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique identifier |
| project | ObjectId | Yes | Reference to Project |
| title | String | Yes | Report title |
| type | String | No | progress/final/evaluation |
| fileUrl | String | No | Uploaded file path |
| origFileName | String | No | Original file name |
| fileSize | Number | No | File size in bytes |
| submissionDate | Date | No | Date of submission |
| status | String | No | submitted/reviewed/approved/rejected |
| feedback | String | No | Evaluation feedback |
| evaluatedBy | ObjectId | No | Reference to User (evaluator) |

## Message Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique identifier |
| conversation | ObjectId | No | Reference to Conversation |
| sender | ObjectId | No | Reference to User (sender) |
| content | String | No | Message text content |
| fileUrl | String | No | Attached file URL |
| fileName | String | No | Attached file name |
| fileSize | Number | No | Attached file size |
| isRead | Boolean | No | Read status (default: false) |

---

# 13. USE CASE DIAGRAM

The Use Case Diagram illustrates the interactions between actors (users) and the system's functionalities.

## Actors
1. **Student** - A registered student user
2. **Supervisor** - A faculty member supervising projects
3. **Admin** - System administrator with full access

## Use Cases by Actor

### Student Use Cases:
1. Register Account
2. Login
3. View Dashboard
4. Create Project Proposal
5. View My Projects
6. Edit Project Proposal
7. Request Supervisor
8. View Tasks
9. Update Task Status
10. View Meetings
11. Submit Report (with file upload)
12. Submit Weekly Report
13. View Milestones
14. Send Messages (Chat)
15. Receive Notifications
16. Update Profile
17. Track Progress

### Supervisor Use Cases:
1. Login
2. View Dashboard
3. View Assigned Projects
4. Approve/Reject Project Proposal
5. Provide Feedback
6. Create Tasks
7. Assign Tasks to Students
8. Update Task Status
9. Schedule Meetings
10. View Reports
11. Review/Evaluate Reports
12. Download Reports
13. View Student Weekly Reports
14. Manage Milestones
15. Send Messages (Chat)
16. View Calendar
17. Update Profile

### Admin Use Cases:
1. Login
2. View Dashboard
3. Manage Users (CRUD)
4. Manage Projects (View/Assign)
5. Assign Supervisors to Projects
6. Manage Departments (CRUD)
7. Manage Announcements (CRUD)
8. View All Reports
9. View All Messages
10. Generate System Reports
11. Configure System Settings
12. Manage Supervisors

---

# 14. USE CASE DESCRIPTIONS

## Use Case 1: User Registration

| Element | Description |
|---------|-------------|
| ID | UC-01 |
| Name | Register Account |
| Actor | Student, Supervisor |
| Precondition | User has valid email, user is not admin |
| Postcondition | User account created in database |
| Main Flow | 1. User navigates to /register<br>2. System displays registration form<br>3. User enters name, email, password, role, department<br>4. Student enters regNo; Supervisor enters designation<br>5. System validates input<br>6. System checks for duplicate email<br>7. System creates user with hashed password<br>8. System returns JWT token and user data |
| Alternate Flow | 6a. Email already exists: System returns error<br>5a. Validation fails: System returns specific error |
| Exception | Admin self-registration is blocked with 403 error |

## Use Case 2: User Login

| Element | Description |
|---------|-------------|
| ID | UC-02 |
| Name | Login |
| Actor | Student, Supervisor, Admin |
| Precondition | User has registered account |
| Postcondition | User authenticated, redirected to dashboard |
| Main Flow | 1. User navigates to /login<br>2. System displays login form with role selection<br>3. User selects role, enters email and password<br>4. System validates all fields are filled<br>5. System queries database with email (includes password field)<br>6. System compares password using bcrypt<br>7. System verifies selected role matches database role<br>8. System checks account is active<br>9. System generates JWT token<br>10. User redirected to role-specific dashboard |
| Alternate Flow | 5a. User not found: "Invalid credentials"<br>6a. Password mismatch: "Invalid credentials"<br>7a. Role mismatch: "This account is registered as [role]"<br>8a. Account inactive: "Account has been deactivated" |

## Use Case 3: Create Project Proposal

| Element | Description |
|---------|-------------|
| ID | UC-03 |
| Name | Create Project Proposal |
| Actor | Student |
| Precondition | Student is authenticated |
| Postcondition | Project created with status 'pending' |
| Main Flow | 1. Student navigates to /student/new-project<br>2. System displays project creation form<br>3. Student enters title, description, technologies<br>4. Student submits form<br>5. System validates required fields<br>6. System creates project document<br>7. Project status set to 'pending'<br>8. Student added as team member<br>9. Activity log created<br>10. Project returned to client |
| Alternate Flow | 5a. Missing title or description: Error returned |

## Use Case 4: Approve/Reject Project

| Element | Description |
|---------|-------------|
| ID | UC-04 |
| Name | Approve/Reject Project |
| Actor | Supervisor, Admin |
| Precondition | Project exists with status 'pending' |
| Postcondition | Project status updated; notification sent |
| Main Flow | 1. Supervisor views project details<br>2. System displays project information and feedback form<br>3. Supervisor selects 'approved' or 'rejected'<br>4. Supervisor optionally adds feedback comment<br>5. System updates project status<br>6. System adds feedback to feedbacks array<br>7. System creates notification for all team members<br>8. System logs activity |

## Use Case 5: Send Real-Time Message

| Element | Description |
|---------|-------------|
| ID | UC-05 |
| Name | Send Message |
| Actor | Student, Supervisor, Admin |
| Precondition | Conversation exists; Socket connection established |
| Postcondition | Message stored and delivered in real-time |
| Main Flow | 1. User opens chat window<br>2. System loads conversations<br>3. User selects a conversation<br>4. System loads messages<br>5. User types message and clicks send<br>6. System creates optimistic message in UI<br>7. System emits 'sendMessage' via socket<br>8. Server creates Message document<br>9. Server updates Conversation.lastMessage<br>10. Server emits 'newMessage' to all participants<br>11. Server emits 'messageSent' to sender |
| Alternate Flow | 2a. No conversations: Empty state displayed<br>5a. File attached: File uploaded first, then message sent with fileUrl |

## Use Case 6: Submit Report

| Element | Description |
|---------|-------------|
| ID | UC-06 |
| Name | Submit Report |
| Actor | Student |
| Precondition | Student is authenticated; Project exists |
| Postcondition | Report created; notifications sent |
| Main Flow | 1. Student navigates to /student/reports<br>2. System displays report submission form<br>3. Student selects project, enters title, selects type<br>4. Student uploads file<br>5. System validates file type and size<br>6. System creates Report document<br>7. System saves file with Multer<br>8. System stores origFileName and fileSize<br>9. System creates notifications for project team members |

## Use Case 7: Review Report

| Element | Description |
|---------|-------------|
| ID | UC-07 |
| Name | Review Report |
| Actor | Supervisor, Admin |
| Precondition | Report exists with status 'submitted' |
| Postcondition | Report status updated; feedback recorded |
| Main Flow | 1. Supervisor views reports list<br>2. Supervisor selects a report to review<br>3. Supervisor views report file (preview/download)<br>4. Supervisor enters feedback text<br>5. Supervisor selects status (approved/rejected)<br>6. System updates Report with status, feedback, evaluatedBy<br>7. System creates notification for team members |

## Use Case 8: Check Deadlines

| Element | Description |
|---------|-------------|
| ID | UC-08 |
| Name | Check Deadlines |
| Actor | System (Automated) |
| Precondition | User is authenticated |
| Postcondition | Deadline alerts displayed if applicable |
| Main Flow | 1. System loads DeadlineAlerts component<br>2. System calls /api/deadlines endpoint<br>3. Server queries for overdue tasks (past due, not completed)<br>4. Server queries for tasks due within 24 hours<br>5. Server queries for overdue milestones<br>6. Server queries for milestones due within 24 hours<br>7. Server creates notifications for overdue tasks if not already created<br>8. Results returned to client<br>9. Client displays alerts as dismissible cards<br>10. System polls every 2 minutes |

---

# 15. CLASS DIAGRAM

```
+-------------------+        +-------------------+       +-------------------+
|       User        |        |     Project       |       |       Task        |
+-------------------+        +-------------------+       +-------------------+
| - _id: ObjectId   |        | - _id: ObjectId   |       | - _id: ObjectId   |
| - name: String    |<-------| - supervisor: Ref  |       | - title: String   |
| - email: String   |        | - teamMembers:[]   |<------| - description:Str |
| - password: String|        | - title: String    |       | - project: Ref    |
| - role: String    |        | - description: Str |       | - assignedTo: Ref |
| - department: Str |        | - technologies:[]  |       | - assignedBy: Ref |
| - regNo: String   |        | - status: String   |       | - status: String  |
| - designation:Str |        | - progress: Number |       | - priority: String|
| - phone: String   |        | - documents:[]     |       | - dueDate: Date   |
| - avatar: String  |        | - feedbacks:[]     |       | + createTask()    |
| - isActive: Bool  |        | + createProject()  |       | + updateTask()    |
| + matchPassword() |        | + updateProject()  |       | + deleteTask()    |
| + generateToken() |        | + approveProject() |       | + getTaskById()   |
+-------------------+        | + addFeedback()    |       +-------------------+
                             +-------------------+
                                      |
        +-----------------------------+-----------------------------+
        |                             |                             |
        v                             v                             v
+-------------------+        +-------------------+       +-------------------+
|     Meeting       |        |     Milestone     |       |      Report       |
+-------------------+        +-------------------+       +-------------------+
| - _id: ObjectId   |        | - _id: ObjectId   |       | - _id: ObjectId   |
| - title: String   |        | - title: String   |       | - title: String   |
| - date: Date      |        | - description:Str |       | - type: String    |
| - duration: Num   |        | - dueDate: Date   |       | - fileUrl: String |
| - notes: String   |        | - completedAt:Date|       | - origFileName:Str|
| - link: String    |        | - status: String  |       | - fileSize: Number|
| - status: String  |        | - order: Number   |       | - submissionDate  |
| - project: Ref    |        | - project: Ref    |       | - status: String  |
| - createdBy: Ref  |        +-------------------+       | - feedback: String|
| - attendees:[]    |                                     | - evaluatedBy:Ref |
+-------------------+        +-------------------+       +-------------------+
                             |   WeeklyReport    |
                             +-------------------+
                             | - _id: ObjectId   |
                             | - weekNumber: Num |
                             | - startDate: Date |
                             | - endDate: Date   |
                             | - workDone: String|
                             | - workPlanned: Str|
                             | - challenges: Str |
                             | - hoursSpent: Num |
                             | - status: String  |
                             | - feedback: String|
                             | - project: Ref    |
                             | - student: Ref    |
                             +-------------------+

+-------------------+       +-------------------+       +-------------------+
|  Conversation     |       |     Message       |       |  Notification     |
+-------------------+       +-------------------+       +-------------------+
| - _id: ObjectId   |       | - _id: ObjectId   |       | - _id: ObjectId   |
| - participants:[] |1----N>| - conversation:Ref|       | - user: Ref       |
| - project: Ref    |       | - sender: Ref     |       | - title: String   |
| - lastMessage: Ref|       | - content: String |       | - message: String |
+-------------------+       | - fileUrl: String |       | - type: String    |
                            | - fileName: String|       | - link: String    |
+-------------------+       | - fileSize: Number|       | - isRead: Boolean |
|   Department      |       | - isRead: Boolean |       +-------------------+
+-------------------+       +-------------------+
| - _id: ObjectId   |                               +-------------------+
| - name: String    |                               |  Announcement     |
| - code: String    |                               +-------------------+
| - head: Ref       |                               | - _id: ObjectId   |
| - description:Str |                               | - title: String   |
| - isActive: Bool  |                               | - content: String |
+-------------------+                               | - createdBy: Ref  |
                                                    | - targetRole: Str |
+-------------------+                               | - isActive: Bool  |
|  ActivityLog      |                               +-------------------+
+-------------------+
| - _id: ObjectId   |
| - user: Ref       |
| - action: String  |
| - description: Str|
| - resource: String|
| - resourceId: OID |
+-------------------+
```

---

# 16. SEQUENCE DIAGRAMS

## 16.1 User Login Sequence

```
User -> LoginPage: Enter credentials
LoginPage -> AuthContext: login(email, password, role)
AuthContext -> API: POST /auth/login
API -> MongoDB: findOne({ email }).select('+password')
MongoDB -> API: user data
API -> MongoDB: compare password
MongoDB -> API: match result
API -> AuthContext: JWT + user data
AuthContext -> localStorage: store user
AuthContext -> LoginPage: user data
LoginPage -> User: redirect to dashboard
```

## 16.2 Project Submission Sequence

```
Student -> StudentProjectsPage: Fill project form
StudentProjectsPage -> API: POST /projects {title, description, technologies}
API -> MongoDB: Project.create()
MongoDB -> API: project document
API -> MongoDB: ActivityLog.create()
API -> StudentProjectsPage: 201 + project
StudentProjectsPage -> Student: Show success and redirect
```

## 16.3 Real-Time Chat Sequence

```
Client A -> Server (Socket.io): connect()
Server -> Server: join(userId)
Client A -> Server: sendMessage({conversationId, senderId, content})
Server -> MongoDB: Message.create()
MongoDB -> Server: message document
Server -> MongoDB: Conversation.findByIdAndUpdate()
Server -> Client B: emit('newMessage')
Server -> Client A: emit('messageSent')
Client A -> Server: typing event
Server -> Client B: emit('userTyping')
Client A -> Server: markRead event
Server -> Client B: emit('messagesRead')
```

## 16.4 Report Submission and Review Sequence

```
Student -> ReportsPage: Upload file + fill form
ReportsPage -> API: POST /reports (multipart/form-data)
API -> Server: Multer file upload
API -> MongoDB: Report.create()
MongoDB -> API: report document
API -> MongoDB: Notification.create()
API -> ReportsPage: 201 + report

Supervisor -> ReportsPage: View reports
ReportsPage -> API: GET /reports
API -> ReportsPage: Reports list
Supervisor -> ReportsPage: Select report, enter feedback
ReportsPage -> API: PUT /reports/:id/review {status, feedback}
API -> MongoDB: Report.findByIdAndUpdate()
API -> MongoDB: Notification.create()
API -> ReportsPage: Updated report
ReportsPage -> Supervisor: Show success
```

---

# 17. ACTIVITY DIAGRAMS

## 17.1 Project Lifecycle Activity

```
[Start] -> Student creates project proposal
       -> Student requests supervisor
       -> Supervisor/Admin reviews proposal
       -> [Approved] -> Project in_progress
                     -> Students work on tasks & milestones
                     -> Students submit weekly reports
                     -> Students submit progress reports
                     -> Supervisor reviews & evaluates reports
                     -> Project completed
       -> [Rejected] -> Project rejected (can be revised)
       -> [End]
```

## 17.2 Report Submission and Review Activity

```
[Student] -> Navigate to Reports page
         -> Click "Submit Report"
         -> Select project, enter title, select type, choose file
         -> Click "Submit"
         -> [Valid] -> File uploaded via Multer to uploads/
                    -> Report saved in DB
                    -> Notification sent
         -> [Invalid] -> Show validation error message -> Return to form
         -> [End]

[Supervisor] -> Navigate to Reports
            -> View reports list
            -> Select report to review
            -> Preview or download attached file
            -> Enter feedback, select status (approved/rejected)
            -> Submit review
            -> Report updated in DB
            -> Notification sent to student
            -> [End]
```

---

# 18. DATA FLOW DIAGRAMS (DFD)

## 18.1 DFD Level 0 (Context Diagram)

```
+---------------------------+
|     Student               |
+---------------------------+
  |                       ^
  v                       |
+---------------------------+
|     Smart FYP             |
|     Management System     |
+---------------------------+
  ^                       |
  |                       v
+---------------------------+
|     Supervisor            |
+---------------------------+

         ^
         |
         v
+---------------------------+
|     Admin                 |
+---------------------------+
```

External Entities: Student (inputs proposals, reports, messages; receives notifications, feedback), Supervisor (inputs evaluations, tasks, meetings; receives project data, reports), Admin (inputs user management, system config; receives system reports, analytics)

## 18.2 DFD Level 1 (Process Decomposition)

```
+---------------------+     +---------------------+
| Authentication      |     | Project Management  |
| Module              |     | Module              |
+---------------------+     +---------------------+
         |                            |
         v                            v
+---------------------+     +---------------------+
| Real-Time           |     | Report & Analytics  |
| Communication       |     | Module              |
| Module (Socket.io)  |     |                     |
+---------------------+     +---------------------+
         |                            |
         v                            v
+---------------------+     +---------------------+
| Notification &      |     | Deadline &          |
| Alert Module        |     | Milestone Module    |
+---------------------+     +---------------------+
         |                            |
         v                            v
+---------------------+     +---------------------+
| File Management     |     | Dashboard &         |
| Module (Multer)     |     | Statistics Module   |
+---------------------+     +---------------------+
```

## 18.3 DFD Level 2 - Project Management

```
Student -> 1.0 Project Create -> Project DB -> 2.0 Task Management -> Task DB -> Student Tasks
Supervisor -> 3.0 Project Approve -> Project DB -> Notification -> Team Members
Admin -> 4.0 Assign Supervisor -> Project DB
```

---

# 19. FLOWCHARTS

## 19.1 Authentication Flowchart

```
[Start] -> User visits /login
       -> Is user logged in? [Yes] -> [Redirect to dashboard]
                            [No]  -> Display login form
                                  -> User submits credentials
                                  -> All fields filled? [No] -> Show error
                                                        [Yes] -> Find user by email
                                                              -> User exists? [No] -> Invalid credentials
                                                                             [Yes] -> Compare password
                                                                                   -> Match? [No] -> Invalid credentials
                                                                                          [Yes] -> Match selected role?
                                                                                                -> [No] -> Role mismatch error
                                                                                                -> [Yes] -> Account active?
                                                                                                         -> [No] -> Account deactivated
                                                                                                         -> [Yes] -> Generate JWT
                                                                                                                  -> Store in localStorage
                                                                                                                  -> Redirect to dashboard
                                                                                                                  -> [End]
```

## 19.2 Report Review Flowchart

```
[Start] -> Supervisor views reports
       -> Select a report to review
       -> Preview/Download attached file
       -> Enter feedback text
       -> Select action: [Approve] or [Reject]
       -> Validate inputs
       -> Update Report in DB: status, feedback, evaluatedBy
       -> Create notification for student
       -> Return updated report
       -> [End]
```

---

# 20. UI/UX DESIGN

## 20.1 Design Philosophy

The Smart FYP Management System follows modern UI/UX principles:
- **Clean and Minimal**: Focus on content with ample whitespace and purposeful color use
- **Consistent**: Unified design language across all pages using Tailwind CSS
- **Responsive**: Mobile-first design across all screen sizes
- **Dark Mode**: Complete dark theme with proper contrast adjustments
- **Feedback-Rich**: Loading spinners, toast notifications, optimistic UI updates, status badges

## 20.2 Color Palette

| Token | Hex Value | Usage |
|-------|-----------|-------|
| primary-500 | #6366f1 | Primary buttons, links, active states |
| primary-600 | #4f46e5 | Hover states, headers |
| primary-700 | #4338ca | Active/pressed states |
| secondary-500 | #22c55e | Success states, completed indicators |
| accent-500 | #f97316 | Warning states, alerts |
| rose-500 | #f43f5e | Error states, overdue indicators |
| amber-500 | #f59e0b | Due-soon indicators |

## 20.3 Key UI Pages

**Login Page**: Two-panel layout with branded hero panel on left (hidden on mobile), login form on right. Features role selection via toggle buttons, email/password inputs with icons, remember me, forgot password, sign in button.

**Student Dashboard**: Stat cards (total projects, approved, pending tasks, completed), project progress chart, recent tasks, upcoming meetings, notifications.

**Supervisor Dashboard**: Stat cards (assigned projects, pending, in-progress, completed), recent projects, upcoming meetings, notifications.

**Admin Dashboard**: System-wide stats (users, students, supervisors, projects), projects by status chart, recent projects, recent users.

**Chat Window**: Two-panel layout. Left sidebar: conversation list with avatars, online status, project name. Right panel: message area with header (participant name, status), message bubbles, input area (emoji picker, file attachment, text input, send button). Mobile: toggleable sidebar via back button.

**Deadline Alerts**: Floating component bottom-right. Dismissible cards: overdue (rose theme) and due-soon (amber theme). Auto-polls server every 2 minutes.

## 20.4 Key UI Components

| Component | Description |
|-----------|-------------|
| StatCard | Animated card with icon, value, title, optional trend indicator |
| Sidebar | Navigation drawer with role-based links, user info, logout |
| Navbar | Top bar with mobile menu, theme toggle, notifications, profile |
| ChatWindow | Full-featured chat with socket.io real-time communication |
| DataTable | Reusable table component for list displays |
| Modal | Overlay modal with backdrop for forms and details |
| LoadingSpinner | Animated spinner with optional fullScreen mode |
| DeadlineAlerts | Floating alert cards for deadline notifications |

---

# 21. TECHNOLOGY STACK

## 21.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library for component-based interfaces |
| React DOM | 18.2.0 | React rendering for web browsers |
| React Router | 6.21.0 | Client-side routing with lazy loading |
| Vite | 5.0.8 | Build tool and dev server with HMR |
| Axios | 1.6.2 | HTTP client with interceptors |
| Socket.io-client | 4.7.2 | Real-time bidirectional communication |
| Tailwind CSS | 3.4.0 | Utility-first CSS framework |
| Chart.js | 4.4.1 | Charting for data visualization |
| React-Chartjs-2 | 5.2.0 | React wrapper for Chart.js |
| Recharts | 2.10.3 | Composable charting library |
| React Icons | 4.12.0 | Feather icons |
| React Hot Toast | 2.4.1 | Toast notification system |

## 21.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.18.2 | Web application framework |
| MongoDB | 6+ | NoSQL document database |
| Mongoose | 8.0.3 | MongoDB ODM with schema validation |
| Socket.io | 4.7.2 | WebSocket server |
| JWT (jsonwebtoken) | 9.0.2 | Authentication tokens |
| bcryptjs | 2.4.3 | Password hashing |
| Multer | 1.4.5 | File upload handling |
| Nodemailer | 6.9.7 | Email sending service |
| dotenv | 16.3.1 | Environment variables |
| cors | 2.8.5 | Cross-Origin Resource Sharing |
| Nodemon | 3.0.2 | Dev auto-restart (devDependency) |

---

# 22. DATABASE DESIGN

## 22.1 Design Principles

- **Schema per collection**: Each entity has a dedicated Mongoose schema
- **Reference-based relationships**: ObjectId references instead of embedded documents for scalability
- **Timestamps on all schemas**: Automatic createdAt/updatedAt for audit trail
- **Validation at schema level**: Required fields, enums, min/max, unique constraints
- **Password security**: select: false on password field to prevent accidental exposure

## 22.2 Collections Overview

| Collection | Primary Index | Purpose |
|------------|---------------|---------|
| users | email (unique) | User accounts and authentication |
| projects | _id | Project proposals and management |
| tasks | _id, (project, status) | Task assignment and tracking |
| meetings | _id | Meeting scheduling and management |
| reports | _id | Report submissions and evaluations |
| messages | _id | Chat message storage |
| conversations | _id | Chat conversation groupings |
| notifications | _id | System notifications |
| milestones | _id | Project milestone tracking |
| weeklyreports | _id | Weekly progress submissions |
| departments | name (unique) | Academic department management |
| announcements | _id | System announcements |
| activitylogs | _id | Audit activity logging |

## 22.3 Relationship Mapping

```
User 1---N Project (as supervisor)
User 1---N Project (as team member)
User 1---N Task (as assignedTo)
User 1---N Task (as assignedBy)
User 1---N Meeting (as createdBy)
User 1---N Meeting (as attendee)
User 1---N Message (as sender)
User 1---N Notification
User 1---N WeeklyReport (as student)
User 1---N ActivityLog
Project 1---N Task
Project 1---N Meeting
Project 1---N Milestone
Project 1---N Report
Project 1---N WeeklyReport
Conversation 1---N Message
```

---

# 23. API DOCUMENTATION

The API follows RESTful conventions. All responses are JSON. Protected routes require a Bearer token in the Authorization header.

Base URL: http://localhost:5000/api (development) or /api (production via proxy)

## Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | No | Register user (student/supervisor) |
| POST | /auth/login | No | Login with email, password, role |
| GET | /auth/me | Yes | Get current user profile |
| PUT | /auth/profile | Yes | Update profile fields |
| POST | /auth/forgot-password | No | Send password reset email |
| PUT | /auth/reset-password/:token | No | Reset password with token |

## User Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /users | Yes | Admin | Get all users |
| GET | /users/supervisors | Yes | Any | Get all supervisors |
| GET | /users/students | Yes | Any | Get all students |
| GET | /users/:id | Yes | Admin | Get user by ID |
| POST | /users | Yes | Admin | Create new user |
| PUT | /users/:id | Yes | Admin | Update user |
| DELETE | /users/:id | Yes | Admin | Delete user |

## Project Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /projects | Yes | Any | Get projects (role-filtered) |
| GET | /projects/stats | Yes | Admin | Get project statistics |
| GET | /projects/:id | Yes | Any | Get project by ID |
| POST | /projects | Yes | Student | Create project |
| PUT | /projects/:id | Yes | Student | Update project |
| DELETE | /projects/:id | Yes | Admin | Delete project |
| POST | /projects/:id/request-supervisor | Yes | Student | Request supervisor |
| PUT | /projects/:id/approve | Yes | Supervisor/Admin | Approve/reject project |
| POST | /projects/:id/feedback | Yes | Supervisor | Add feedback |
| POST | /projects/:id/upload | Yes | Student | Upload document |
| PUT | /projects/:id/assign-supervisor | Yes | Admin | Assign supervisor |

## Task Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /tasks | Yes | Any | Get tasks (role-filtered) |
| GET | /tasks/:id | Yes | Any | Get task by ID |
| POST | /tasks | Yes | Supervisor | Create task |
| PUT | /tasks/:id | Yes | Any | Update task |
| DELETE | /tasks/:id | Yes | Supervisor/Admin | Delete task |

## Meeting Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /meetings | Yes | Any | Get meetings (role-filtered) |
| POST | /meetings | Yes | Supervisor | Create meeting |
| PUT | /meetings/:id | Yes | Supervisor/Admin | Update meeting |
| DELETE | /meetings/:id | Yes | Supervisor/Admin | Delete meeting |

## Report Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /reports | Yes | Any | Get reports (role-filtered) |
| POST | /reports | Yes | Student | Submit report (multipart/form-data) |
| GET | /reports/:id/download | Yes | Any | Download report file |
| PUT | /reports/:id/review | Yes | Supervisor/Admin | Review report |

## Message Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /messages/conversations | Yes | Any | Get user conversations |
| POST | /messages/conversations | Yes | Any | Create conversation |
| GET | /messages/conversations/:id/messages | Yes | Any | Get messages |
| POST | /messages/conversations/:id/messages | Yes | Any | Send message |

## Notification Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /notifications | Yes | Any | Get user notifications |
| PUT | /notifications/:id/read | Yes | Any | Mark notification as read |
| PUT | /notifications/read-all | Yes | Any | Mark all as read |
| GET | /notifications/unread-count | Yes | Any | Get unread count |

## Department Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /departments | Yes | Any | Get all departments |
| GET | /departments/:id | Yes | Admin | Get department by ID |
| POST | /departments | Yes | Admin | Create department |
| PUT | /departments/:id | Yes | Admin | Update department |
| DELETE | /departments/:id | Yes | Admin | Delete department |

## Additional Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /dashboard/admin | Yes | Admin | Admin dashboard data |
| GET | /dashboard/supervisor | Yes | Supervisor | Supervisor dashboard data |
| GET | /dashboard/student | Yes | Student | Student dashboard data |
| GET | /milestones | Yes | Any | Get milestones |
| POST | /milestones | Yes | Supervisor | Create milestone |
| PUT | /milestones/:id | Yes | Supervisor/Admin | Update milestone |
| DELETE | /milestones/:id | Yes | Supervisor/Admin | Delete milestone |
| GET | /weekly-reports | Yes | Any | Get weekly reports |
| POST | /weekly-reports | Yes | Student | Create weekly report |
| GET | /calendar | Yes | Supervisor | Get calendar events |
| GET | /deadlines | Yes | Any | Check deadlines |
| GET | /reports/generate | Yes | Admin | Generate system reports |
| GET/POST/PUT/DELETE | /announcements | Yes | Admin | Announcement CRUD |

---

# 24. AUTHENTICATION & AUTHORIZATION FLOW

## 24.1 Authentication Process

1. **Registration**: User submits data -> Server validates -> Hashes password (bcrypt, 10 rounds) -> Creates user -> Returns JWT + user data.

2. **Login**: User submits email, password, role -> Server finds user by email -> Compares password -> Verifies role -> Checks active -> Generates JWT (payload: {id, role}) -> Returns token + user data.

3. **Token Storage**: Client stores user object (including token) in localStorage under key 'user'.

4. **Authenticated Requests**: Axios interceptor reads user from localStorage, attaches Authorization: Bearer token header.

5. **Token Verification**: Server middleware (protect) extracts token -> jwt.verify() -> Finds user by decoded ID -> Attaches req.user.

6. **401 Handling**: Axios response interceptor catches 401 -> Clears localStorage -> Redirects to /login.

## 24.2 Authorization Process

1. **Role middleware**: authorize(...roles) middleware checks req.user.role against allowed roles.
2. **Route protection**: ProtectedRoute component checks loading -> user -> role match.
3. **Data filtering**: Controllers filter queries based on user role (students see own projects, supervisors see assigned, admins see all).

## 24.3 Security Flow

```
Client -> POST /auth/login {email, password, role}
Server -> Find user by email (select +password)
Server -> bcrypt.compare(password, hash)
Server -> If match: jwt.sign({id, role}, secret)
Server -> Return {user, token}
Client -> Store in localStorage
Client -> Every API call: Authorization: Bearer <jwt>
Server -> jwt.verify(token, secret)
Server -> User.findById(decoded.id)
Server -> authorize('supervisor', 'admin') (if needed)
Server -> Execute controller
Server -> Return response
On 401: Client -> localStorage.clear() -> window.location = /login
```

---

# 25. MODULE DESCRIPTIONS

## 25.1 Student Module

**Purpose**: Provides students with tools to manage their FYP lifecycle.

**Features**: Dashboard (overview, stats, charts), Project Management (create, view, edit proposals, request supervisor), Task Tracking (view and update status), Meetings (view upcoming/past), Reports (submit progress/final/evaluation reports with file uploads), Weekly Reports (submit work details), Progress Tracking (milestone completion, visual progress), Chat (real-time messaging), Notifications, Profile.

**API Endpoints**: GET /dashboard/student, GET/POST/PUT /projects, GET /tasks, GET /meetings, POST /reports, POST /weekly-reports, GET /milestones

## 25.2 Supervisor Module

**Purpose**: Enables faculty to manage projects, evaluate work, and communicate.

**Features**: Dashboard (assigned projects stats), Project Management (approve/reject, feedback), Student Management, Task Management (create, assign, prioritize), Meetings (schedule and manage), Reports (view, evaluate, download), Weekly Reports (view, provide feedback), Milestones (create, manage), Calendar, Chat, Notifications.

**API Endpoints**: GET /dashboard/supervisor, GET/PUT /projects, POST /tasks, GET/POST /meetings, GET/PUT /reports, GET/POST/PUT /milestones, GET /calendar

## 25.3 Admin Module

**Purpose**: System-wide oversight and management.

**Features**: Dashboard (system-wide statistics), User Management (CRUD), Project Management (view all, assign supervisors), Department Management (CRUD), Announcements (CRUD), Reports (view all, generate system reports), Messages (view all), Settings.

**API Endpoints**: GET /dashboard/admin, CRUD /users, GET/PUT /projects, CRUD /departments, CRUD /announcements, GET /reports, GET /reports/generate, GET /messages

---

# 26. CHAT MODULE WORKFLOW

## 26.1 Architecture

The chat module uses Socket.io for real-time bidirectional communication over WebSockets with HTTP long-polling fallback.

**Server Events**: 'join' (user room), 'sendMessage' (message with conversationId, senderId, content, fileUrl, fileName), 'typing'/'stopTyping' (indicators), 'markRead' (read receipts), 'disconnect' (cleanup)

**Client Events**: 'newMessage' (received message), 'messageSent' (confirmation), 'userOnline'/'userOffline' (presence), 'userTyping'/'userStoppedTyping', 'messagesRead' (receipts)

## 26.2 Message Flow

1. Connection: User logs in -> Socket establishes connection -> emit 'join' with userId
2. Sending: User sends -> Optimistic UI update -> emit 'sendMessage' -> Server creates Message, updates Conversation -> broadcast 'newMessage' to participants -> emit 'messageSent' to sender -> Update optimistic message
3. Typing: User types -> emit 'typing' with debounce (1s) -> broadcast 'userTyping' -> After 1s idle -> emit 'stopTyping'
4. Read receipts: Open conversation -> emit 'markRead' -> Update unread messages -> broadcast 'messagesRead'
5. Presence: On 'join' -> add to onlineUsers Set -> broadcast 'userOnline' -> On 'disconnect' -> remove -> broadcast 'userOffline'

## 26.3 File Sharing

1. User clicks paperclip icon -> File picker opens
2. File stored in component state
3. On send: file uploaded via REST API (projectAPI.uploadDocument)
4. File URL included in socket message payload
5. Receiver sees file with download link

---

# 27. PROGRESS REPORT WORKFLOW

## 27.1 Weekly Report Lifecycle

Draft (Student) -> Submitted (Student) -> Reviewed (Supervisor)

1. Create: Student fills week number, date range, work done, planned, challenges, hours. Status: 'draft'
2. Submit: Student changes status to 'submitted'. Visible to supervisor.
3. Review: Supervisor views, provides feedback.

## 27.2 Report Submission Lifecycle

Submitted (Student) -> Reviewed (Supervisor) -> Approved or Rejected

1. Submit: Student selects project, title, type, uploads file. Status: 'submitted'
2. Review: Supervisor previews/downloads file, enters feedback, approves or rejects.
3. Notification: Team members notified of outcome.

## 27.3 Milestone Progress

Milestones track key project phases. Status: pending -> in_progress -> completed -> overdue. When all milestones complete, project approaches 100% progress.

## 27.4 Project Progress Calculation

```javascript
const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
};
```

When task marked completed: completedAt set, all project tasks fetched, progress recalculated, project.progress updated.

---

# 28. TESTING

## 28.1 Testing Strategy

**Unit Testing**: Individual functions, methods, and components (Mongoose model validation, utility functions, password hashing, JWT, socket events, API service layer).

**Integration Testing**: Interactions between components (login->dashboard flow, project creation->approval, report submission->download, message sending->socket->database, deadline checking->notification, role-based filtering).

**System Testing**: End-to-end workflows (complete student journey, supervisor journey, admin journey, mobile responsiveness, dark mode).

## 28.2 Test Results Summary

| Category | Tests | Passed | Rate |
|----------|-------|--------|------|
| Authentication | 9 | 9 | 100% |
| Project Management | 7 | 7 | 100% |
| Reports & Files | 8 | 8 | 100% |
| Chat & Real-time | 7 | 7 | 100% |
| Deadlines & Alerts | 4 | 4 | 100% |
| Performance | 4 | 4 | 100% |
| **Total** | **39** | **39** | **100%** |

---

# 29. TEST CASES AND RESULTS

## Authentication Tests

| ID | Test Case | Expected | Status |
|----|-----------|----------|--------|
| TC-01 | Login with valid credentials | JWT token returned | PASS |
| TC-02 | Login with wrong password | "Invalid credentials" | PASS |
| TC-03 | Login with wrong role | Role mismatch error | PASS |
| TC-04 | Login with inactive account | "Account deactivated" | PASS |
| TC-05 | Register new student | User created, token returned | PASS |
| TC-06 | Register with existing email | "User already exists" | PASS |
| TC-07 | Admin self-registration | 403 forbidden | PASS |
| TC-08 | Access without token | 401 unauthorized | PASS |
| TC-09 | Wrong role accessing route | 403 forbidden | PASS |

## Project Tests

| ID | Test Case | Expected | Status |
|----|-----------|----------|--------|
| TC-10 | Create project | 201, project created | PASS |
| TC-11 | Create project without title | Validation error | PASS |
| TC-12 | Approve project | Status updated | PASS |
| TC-13 | Reject with feedback | Both updated | PASS |
| TC-14 | Student sees own projects | Filtered correctly | PASS |
| TC-15 | Supervisor sees assigned | Filtered correctly | PASS |
| TC-16 | View with populated data | All references populated | PASS |

## Report Tests

| ID | Test Case | Expected | Status |
|----|-----------|----------|--------|
| TC-17 | Submit report with file | 201, file saved | PASS |
| TC-18 | Submit without file | Created, no fileUrl | PASS |
| TC-19 | Download report file | Download triggers | PASS |
| TC-20 | Download no file report | 404 "No file attached" | PASS |
| TC-21 | Unauthorized download | 403 forbidden | PASS |
| TC-22 | Review report | Updated correctly | PASS |
| TC-23 | Invalid file type | Rejected with error | PASS |
| TC-24 | File > 10 MB | Rejected with limit error | PASS |

## Chat Tests

| ID | Test Case | Expected | Status |
|----|-----------|----------|--------|
| TC-25 | Send text message | Message saved, delivered | PASS |
| TC-26 | Real-time delivery | Instant delivery | PASS |
| TC-27 | Typing indicator | Shows "typing..." | PASS |
| TC-28 | Self-message no toast | Toast suppressed | PASS |
| TC-29 | Online status | Green dot/hidden | PASS |
| TC-30 | Create conversation | 201, correct participants | PASS |
| TC-31 | Mark messages read | isRead = true | PASS |

## Performance Tests

| ID | Test Case | Expected | Actual | Status |
|----|-----------|----------|--------|--------|
| TC-32 | Bundle size | < 150 KB gzip | ~99 KB | PASS |
| TC-33 | Code chunks | > 30 chunks | 41 chunks | PASS |
| TC-34 | Total modules | < 200 | 176 | PASS |
| TC-35 | API latency | < 500ms | ~150ms avg | PASS |

---

# 30. VALIDATION AND ERROR HANDLING

## 30.1 Client-Side Validation

- Form validation: required fields, email format, password min 6 chars, role selection
- File validation: type (jpeg, jpg, png, pdf, doc, docx), size (max 10 MB)
- API interceptors: 401 triggers logout and redirect
- Optimistic UI: immediate feedback with rollback on error
- Toast notifications: success/error for all submissions
- Loading states: spinners, button loading, skeleton screens

## 30.2 Server-Side Validation

- Mongoose schema validation: required, enum, min/max, unique
- Auth middleware: JWT verification, user existence, role authorization
- Input validation: required field checks, minimum lengths
- File upload: Multer file filter (allowed types), size limit (10 MB)
- Error handling: All controllers wrapped in try-catch with consistent JSON error format

## 30.3 Error Response Format

```json
{ "message": "Human-readable error description" }
```

HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error)

## 30.4 Edge Cases Handled

| Case | Handling |
|------|----------|
| Empty task/milestone lists | Empty state messages |
| User with no projects | "No projects yet" with CTA |
| File missing on disk | 404 "File not found on server" |
| Deleted conversation user | Show "Unknown" as name |
| Duplicate email | 400 "User already exists" |
| Self-message | Toast suppressed |
| Expired reset token | "Invalid or expired reset token" |
| Invalid file type | Multer error propagated |
| Socket disconnect | Auto-reconnect |

---

# 31. SECURITY FEATURES

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcryptjs with 10 salt rounds |
| Password Field Protection | select: false on Mongoose schema |
| JWT Tokens | Signed with secret, configurable expiry |
| Role Verification | Server validates role against database |
| Account Status | isActive checked on login |
| Route Protection | protect middleware on all authenticated routes |
| Role-Based Access | authorize() middleware for role gating |
| Data Filtering | Queries scoped to user role/ID |
| Admin Registration Block | 403 at controller level |
| File Upload Validation | Multer type + size filter |
| CORS | cors middleware configured |
| Environment Variables | All secrets in .env |

---

# 32. PERFORMANCE OPTIMIZATION

| Technique | Implementation | Benefit |
|-----------|---------------|---------|
| Code Splitting | React.lazy() on 34 pages | Bundle 99 KB gzip (was ~450 KB) |
| Lazy Loading | Suspense with spinner fallback | Pages load on demand |
| Vite Build | ESBuild bundling, tree-shaking | Fast builds, minimal output |
| CSS Optimization | Tailwind purge unused styles | CSS 8.56 KB gzip |
| Optimistic UI | Immediate updates for chat | Perceived instant responsiveness |
| Debounced Typing | 1-second debounce | Reduced socket events |
| Query Filtering | Role-based query scoping | Reduced result sets |
| Pagination | Projects/tasks page/limit | Controlled response size |
| Promise.all | Parallel dashboard/deadline queries | Reduced response time |

**Build Output**: Main bundle 314 KB (99 KB gzip), CSS 54 KB (8.5 KB gzip), 41 chunks (0.1-14.1 KB each), 176 modules, build time 3.49s

---

# 33. CHALLENGES FACED

| Challenge | Solution |
|-----------|----------|
| Real-time Chat Reliability | Socket.io auto-reconnect, optimistic updates, REST fallback |
| Role-Based Data Filtering | Query filters in controllers based on req.user.role |
| File Upload Memory | Multer 10MB limit, disk storage |
| Code Splitting Complexity | Consistent Suspense fallback, lazy imports |
| Socket Event Duplication | useRef for activeConv tracking, cleanup in useEffect |
| Dark Mode CSS | dark: variants on all custom styles, fixed selector |
| Mobile Chat UX | showSidebar state toggle, back button, responsive classes |
| Optimistic Messages | tempId prefix matching in messageSent handler |
| Deadline Alert Positioning | Fixed bottom-right, responsive mobile centering |

---

# 34. FUTURE ENHANCEMENTS

**Short-Term**: Email notifications, file version history, full-text search, calendar sync, bulk operations.

**Medium-Term**: Mobile apps (React Native), AI plagiarism detection, enhanced analytics, rubric-based evaluation, peer review system.

**Long-Term**: LMS integration, video conferencing, automated progress reports (AI), multi-institution support, blockchain verification.

---

# 35. CONCLUSION

The Smart FYP Management System successfully addresses critical challenges in traditional Final Year Project management by providing a centralized, role-based platform with real-time communication capabilities. Built with the MERN stack, Socket.io, Tailwind CSS, and JWT authentication, the system streamlines the entire FYP lifecycle from proposal submission to final evaluation.

Key accomplishments: three role-specific dashboards, real-time chat with typing/file/presence support, milestone-based progress tracking, report submission and review workflow, deadline alert system, comprehensive API (35+ endpoints), code-split 99 KB gzip bundle, robust security, and responsive design. Testing confirmed 100% pass rate across 39 test cases.

---

# 36. REFERENCES (APA Format)

1. Banks, A., & Porcello, E. (2017). *Learning React: Functional web development with React and Redux*. O'Reilly Media.
2. Dickey, J. (2020). *Write modern web apps with the MEAN stack*. Peachpit Press.
3. Fowler, M. (2002). *Patterns of enterprise application architecture*. Addison-Wesley.
4. Haverbeke, M. (2018). *Eloquent JavaScript* (3rd ed.). No Starch Press.
5. MongoDB Inc. (2023). *MongoDB documentation*. https://www.mongodb.com/docs/
6. npm, Inc. (2023). *npm documentation*. https://docs.npmjs.com/
7. OpenJS Foundation. (2023). *Express.js documentation*. https://expressjs.com/
8. React Documentation. (2023). *React reference documentation*. https://react.dev/
9. Socket.io. (2023). *Socket.io documentation*. https://socket.io/docs/
10. Subramanian, V. (2019). *Pro MERN Stack*. Apress.
11. Tailwind CSS. (2023). *Tailwind CSS documentation*. https://tailwindcss.com/docs
12. Vite. (2023). *Vite documentation*. https://vitejs.dev/
13. Zell, L. (2020). *Working with Node.js*. Smashing Magazine.

---

# 37. APPENDICES

## Appendix A: Environment Configuration

Server .env file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-fyp
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Appendix B: Database Seed Data

Admin user: admin@university.edu / admin123 (created via node utils/createAdmin.js)
Seed data: sample departments, users, projects, tasks, meetings, reports (via node utils/seedData.js)

## Appendix C: Deployment Instructions

**Server**: cd server -> npm install -> configure .env -> npm run seed -> npm run create-admin -> npm start
**Client**: cd client -> npm install -> npm run build -> npm run preview (or deploy dist/ folder)

## Appendix D: Socket Events Reference

Client -> Server: join (userId), sendMessage (conversationId, senderId, content), typing, stopTyping, markRead, disconnect
Server -> Client: newMessage (populated message), messageSent, userOnline, userOffline, userTyping, userStoppedTyping, messagesRead

## Appendix E: Project Directory Structure

```
smart-fyp-management-system/
+-- client/                         # React Frontend
|   +-- index.html                  # HTML entry point
|   +-- vite.config.js              # Vite configuration
|   +-- tailwind.config.js          # Tailwind CSS config
|   +-- src/
|       +-- main.jsx                # React entry
|       +-- App.jsx                 # Root with routes
|       +-- index.css               # Global styles
|       +-- context/                # AuthContext, SocketContext, ThemeContext
|       +-- components/             # layout/, chat/, deadlines/, ui/, notifications/
|       +-- pages/                  # auth/, student/ (10), supervisor/ (9), admin/ (10)
|       +-- layouts/                # DashboardLayout.jsx
|       +-- routes/                 # ProtectedRoute.jsx
|       +-- services/               # api.js (Axios)
|       +-- utils/                  # helpers.js
+-- server/                         # Node.js Backend
|   +-- server.js                   # Entry point
|   +-- config/                     # db.js, cloudinary.js
|   +-- models/                     # 13 Mongoose models
|   +-- controllers/                # 17 controllers
|   +-- routes/                     # 17 route modules
|   +-- middleware/                 # auth.js, upload.js, errorMiddleware.js
|   +-- utils/                      # helpers.js, emailService.js, createAdmin.js, seedData.js
|   +-- uploads/                    # Uploaded files
```
