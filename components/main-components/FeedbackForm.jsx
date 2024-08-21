import React from 'react';

const FeedbackForm = ({ feedback, handleFeedbackChange, handleSubmitFeedback }) => (
    <div className="mb-4 bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="feedback">
            Feedback
        </label>
        <textarea
            id="feedback"
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Please provide your feedback before checking out..."
            className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
        />
        <button
            onClick={handleSubmitFeedback}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
        >
            Submit Feedback
        </button>
    </div>
);

export default FeedbackForm;
