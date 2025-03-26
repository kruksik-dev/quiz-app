import { motion } from 'framer-motion';
import React, { useState } from 'react';
import './AddQuestionPopup.css';

const AddQuestionPopup = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        question: '', option_1: '', option_2: '', option_3: '', option_4: '', correct_option: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            alert("Question added successfully!");
        } catch (error) {
            alert("Failed to add the question. Please try again.");
        }
    };

    return (
        <motion.div
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="popup-content"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2>Add New Question</h2>
                <form onSubmit={handleSubmit}>
                    {['question', 'option_1', 'option_2', 'option_3', 'option_4', 'correct_option'].map((field, index) => (
                        <input
                            key={index}
                            type="text"
                            name={field}
                            placeholder={field.replace('_', ' ')}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                        />
                    ))}
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