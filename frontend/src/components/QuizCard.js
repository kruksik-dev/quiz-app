import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import './QuizCard.css';

const QuizCard = ({ question, onNext }) => {
    const [selected, setSelected] = useState(null);
    const [result, setResult] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null); 

    const checkAnswer = async (index) => {
        try {
            const response = await axios.post(`${window.__RUNTIME_CONFIG__.API_URL}/check_answer/`, null, {
                params: { question_id: question.id, selected_option: index }
            });
            setResult(response.data.message);
            setIsCorrect(response.data.correct);
        } catch (error) {
            setResult('Failed to check answer');
            setIsCorrect(false);
        }
    };

    const handleSelect = (index) => {
        setSelected(index);
        checkAnswer(index);
    };

    const handleNext = () => {
        setSelected(null);
        setResult(null);
        setIsCorrect(null);
        onNext(); 
    };

    const options = [
        question.option_1,
        question.option_2,
        question.option_3,
        question.option_4
    ].filter(option => option !== undefined);

    return (
        <motion.div
            className="quiz-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="quiz-header">Pytanie</div>
            <div className="quiz-question">{question.question}</div>
            <div className="quiz-options">
                {options.map((option, index) => (
                    <motion.button
                        key={index}
                        className={`quiz-option ${selected === index + 1 ? 'selected' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelect(index + 1)}
                    >
                        {option}
                    </motion.button>
                ))}
            </div>
            {result && (
                <p className={`quiz-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {result}
                </p>
            )}
            <motion.button
                className="quiz-next-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
            >
                Następne pytanie
            </motion.button>
        </motion.div>
    );
};

export default QuizCard;