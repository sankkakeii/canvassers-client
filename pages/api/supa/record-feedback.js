import { supabase } from "@/utils/superbase";
import { verifyToken } from '@/utils/auth'

// Logging function to write logs to Supabase
const logActivity = async (logType, message, additionalInfo = {}) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        log_type: logType,
        message,
        additional_info: additionalInfo
    };

    try {
        const { error } = await supabase
            .from('canvassers_feedback_logs')
            .insert([logEntry]);

        if (error) {
            console.error('Error inserting log:', error);
        }
    } catch (err) {
        console.error('Error logging activity:', err);
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        await logActivity('ERROR', 'Invalid request method for recording feedback', { method: req.method });
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { feedbackData } = req.body;
    const user = verifyToken(req);

    if (!user) {
        await logActivity('FAILURE', 'Unauthorized feedback submission attempt');
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
            await logActivity('ERROR', 'Database insertion error during feedback recording', { error, userId: user.userId });
            throw error;
        }

        await logActivity('SUCCESS', 'Feedback recorded successfully', { userId: user.userId });
        res.status(200).json({ message: 'Feedback recorded successfully', data });
    } catch (error) {
        await logActivity('ERROR', 'An error occurred during feedback submission', { error: error.message, userId: user.userId });
        console.error(error);
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
