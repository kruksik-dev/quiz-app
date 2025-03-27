import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';
import AddQuestionPopup from './components/AddQuestionPopup';
import ParticlesBg from "particles-bg";
import QuizCard from './components/QuizCard';


const MemoizedParticlesBg = React.memo(() => (
  <ParticlesBg type="random" num={25}  bg={true} />
));

const App = () => {
  const [question, setQuestion] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, []);


  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`${window.__RUNTIME_CONFIG__.API_URL}/random_question/`, {
        withCredentials: true,
      });
      setQuestion(response.data);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleAddQuestion = async (formData) => {
    await axios.post(`${window.__RUNTIME_CONFIG__.API_URL}/question/`, null, { params: formData });
    setShowPopup(false);
    fetchQuestion();
  };

  
  useEffect(() => {
    const handleKeyDown = (e) => {

      if (e.shiftKey && e.key === 'Q') {
        setShowAddButton((prevState) => !prevState);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  return (
    <>
      <div className="app">
        <div className="quiz-container">
          {question && <QuizCard question={question} onNext={fetchQuestion} />}
          {showAddButton && ( 
            <button className="add-question-btn" onClick={() => setShowPopup(true)}>
              Add Question
            </button>
          )}
        </div>
        {showPopup && (
          <AddQuestionPopup
            onClose={() => setShowPopup(false)}
            onSubmit={handleAddQuestion}
          />
        )}
      </div>
      <MemoizedParticlesBg />
    </>
  );
};

export default App;
