# Quiz App 🎉

Welcome to the **Quiz App**, a modern and interactive platform for creating, managing, and playing quizzes. This project is built with a robust backend and a dynamic frontend to deliver a seamless user experience.

---

## 🌟 Features

- **Dynamic Quiz Gameplay**: Answer questions and get instant feedback.
- **Add Questions**: Easily add new questions via a user-friendly popup.
- **Bulk Upload**: Upload multiple questions using a CSV file.
- **Randomized Questions**: Get a new random question every time.
- **Keyboard Shortcut**: Toggle the "Add Question" button with `Shift + Q`.
- **Responsive Design**: Optimized for all devices.

---

## 🛠️ Tech Stack

### Frontend
- **React**: For building the user interface.
- **Framer Motion**: For smooth animations.
- **Axios**: For API communication.

### Backend
- **FastAPI**: For building the RESTful API.
- **SQLModel**: For database modeling and interaction.
- **SQLite**: Lightweight database for storing questions.

### DevOps
- **Docker**: Containerized deployment.
- **Docker Compose**: Simplified multi-container setup.

---

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/quiz-app.git
   cd quiz-app
   ```

2. Start the application:
   ```bash
   docker-compose up -d
   ```

3. Access the app:
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📂 Project Structure

```
quiz-app/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   └── main.py       # FastAPI routes
│   │   ├── database/
│   │   │   ├── database.py   # Database initialization
│   │   │   └── model.py      # Database models
│   └── Dockerfile            # Backend Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.js            # Main React app
│   │   └── index.js          # React entry point
│   └── Dockerfile            # Frontend Dockerfile
├── docker-compose.yml         # Docker Compose configuration
└── README.md                  # Project documentation
```

---

## 🖥️ Usage

### Adding a Question
1. Press `Shift + Q` to toggle the "Add Question" button.
2. Click the button to open the popup.
3. Fill in the question details and submit.

### Bulk Upload
1. Navigate to the `/add_bulk_questions/` endpoint in the API docs.
2. Upload a CSV file with the following columns:
   - `question`, `option_1`, `option_2`, `option_3`, `option_4`, `correct_option`.

### Playing the Quiz
1. Open the app in your browser.
2. Answer the displayed question.
3. Click "Next Question" to proceed.

---

## 📜 API Endpoints

### Questions
- `POST /question/`: Add a new question.
- `GET /question/{id}`: Get a question by ID.
- `PATCH /question/{id}`: Update a question.
- `DELETE /question/{id}`: Delete a question.
- `GET /question/`: Get all questions (paginated).
- `POST /add_bulk_questions/`: Add multiple questions via CSV.
- `GET /random_question/`: Get a random question.
- `POST /check_answer/`: Check if the selected answer is correct.

---


## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


Enjoy the Quiz App! 🎉
