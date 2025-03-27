import { motion } from 'framer-motion';
import React, { useState } from 'react';
import './AddQuestionPopup.css';
import axios from 'axios';

const AddQuestionPopup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        question: '',
        option_1: '',
        option_2: '',
        option_3: '',
        option_4: '',
        correct_option: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                correct_option: parseInt(formData.correct_option)
            };

            const response = await axios.post(
                `${window.__RUNTIME_CONFIG__.API_URL}/question/`,
                submissionData
            );
            
            alert("Question added successfully!");
            onClose();
        } catch (error) {
            console.error('Error adding question:', error);
            alert(`Failed to add the question: ${error.response?.data?.detail || error.message}`);
        }
    };

    return (
        <motion.div className="popup-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="popup-content" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <h2>Add New Question</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Question Text</label>
                        <textarea
                            name="question"
                            value={formData.question}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {[1, 2, 3, 4].map((num) => (
                        <div key={num} className="form-group">
                            <label>Option {num}</label>
                            <input
                                type="text"
                                name={`option_${num}`}
                                value={formData[`option_${num}`]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    
                    <div className="form-group">
                        <label>Correct Option Number (1-4)</label>
                        <select
                            name="correct_option"
                            value={formData.correct_option}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select correct option</option>
                            {[1, 2, 3, 4].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="popup-buttons">
                        <button type="submit" className="submit-btn">Add Question</button>
                        <button type="button" onClick={onClose} className="close-btn">Close</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AddQuestionPopup;