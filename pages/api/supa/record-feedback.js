import { supabase } from "@/utils/superbase";
import { verifyToken } from '@/utils/auth'
import fs from 'fs'
import path from 'path'

// Logging function to write logs to a JSON file
const logActivity = (logType, message, additionalInfo = {}) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        logType,
        message,
        ...additionalInfo
    };

    const logFilePath = path.join(process.cwd(), 'logs', 'feedbackLogs.json');

    // Ensure the logs directory exists
    if (!fs.existsSync(path.dirname(logFilePath))) {
        fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    }

    // Read existing logs
    const existingLogs = fs.existsSync(logFilePath) ? JSON.parse(fs.readFileSync(logFilePath)) : [];

    // Append the new log entry
    existingLogs.push(logEntry);

    // Write the updated logs back to the file
    fs.writeFileSync(logFilePath, JSON.stringify(existingLogs, null, 2));
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        logActivity('ERROR', 'Invalid request method for recording feedback', { method: req.method });
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { feedbackData } = req.body;
    const user = verifyToken(req);

    if (!user) {
        logActivity('FAILURE', 'Unauthorized feedback submission attempt');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { data, error } = await supabase
            .from('canvassers_feedback')
            .insert([{
                user_id: user.userId,
                sales: feedbackData.sales,
                name: feedbackData.name,
                email: feedbackData.email,
                slot_location: feedbackData.slot_location,
                reason: feedbackData.reason,
                improvement: feedbackData.improvement,
                extra_feedback: feedbackData.extraFeedback
            }]);

        if (error) {
            logActivity('ERROR', 'Database insertion error during feedback recording', { error });
            throw error;
        }

        logActivity('SUCCESS', 'Feedback recorded successfully', { userId: user.userId });
        res.status(200).json({ message: 'Feedback recorded successfully', data });
    } catch (error) {
        logActivity('ERROR', 'An error occurred during feedback submission', { error: error.message });
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}









// // pages/api/supa/record-feedback.js
// import { supabase } from "@/utils/superbase";
// import { verifyToken } from '@/utils/auth';

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: 'Method not allowed' });
//     }

//     const { feedbackData } = req.body;

//     const user = verifyToken(req);

//     if (!user) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     try {
//         const { data, error } = await supabase
//             .from('feedback_duplicate')
//             .upsert(
//                 [{
//                     user_id: user.userId,
//                     sales: feedbackData.sales,
//                     name: feedbackData.name,
//                     email: feedbackData.email,
//                     slot_location: feedbackData.slot_location,
//                     reason: feedbackData.reason,
//                     improvement: feedbackData.improvement,
//                     extra_feedback: feedbackData.extraFeedback,
//                 }],
//                 { 
//                     onConflict: ['id'], // Handle conflict on the 'id' column
//                     returning: 'minimal' // Optimize by not returning the entire row data
//                 }
//             );

//         if (error) {
//             throw error;
//         }

//         res.status(200).json({ message: 'Feedback recorded successfully', data });
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ message: error.message });
//     }
// }
