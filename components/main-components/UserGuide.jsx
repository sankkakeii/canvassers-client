import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const UserGuideModal = ({ showTutorial, setShowTutorial }) => (
    <>
        <FaInfoCircle
            className="absolute top-3 left-3 text-red-500 text-2xl cursor-pointer"
            onClick={() => setShowTutorial(true)}
        />
        {showTutorial && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg relative">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        onClick={() => setShowTutorial(false)}
                    >
                        &times;
                    </button>
                    <h2 className="text-lg font-bold mb-4">User Guide</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Check-In:</strong> Click &quot;Check In&quot; to confirm your attendance.
                        </li>
                        <li>
                            <strong>Provide Feedback:</strong> Please fill out the feedback form before checking out.
                        </li>
                        <li>
                            <strong>Check-Out:</strong> You can only check out after submitting your feedback.
                        </li>
                    </ul>
                </div>
            </div>
        )}
    </>
);

export default UserGuideModal;
