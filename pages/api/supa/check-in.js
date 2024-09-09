import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '@/utils/auth'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

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
            .from('canvassers_checkin_logs')
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
        // await logActivity('ERROR', 'Invalid request method for check-in', { method: req.method });
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = verifyToken(req);
        if (!user) {
            await logActivity('FAILURE', 'Unauthorized check-in attempt');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { name, email, location, branch, distanceToBranch, isWithin400Meters } = req.body;

        const { data, error } = await supabase
            .from('canvassers_check_ins')
            .insert([
                {
                    name,
                    email,
                    user_id: user.userId,
                    location,
                    branch,
                    check_in_time: new Date(),
                    distance_to_branch: distanceToBranch,
                    within_400_meters: isWithin400Meters,
                }
            ]);

        if (error) {
            await logActivity('ERROR', 'Database insertion error during check-in', { error, userId: user.userId, name, email });
            throw error;
        }

        await logActivity('SUCCESS', 'User checked in successfully', { userId: user.userId, name, email });
        res.status(200).json({ message: 'Checked in successfully' });
    } catch (error) {
        await logActivity('ERROR', 'An error occurred during check-in', { error: error.message, userId: user.userId, name, email });
        console.error('Check-in error:', error);
        res.status(500).json({ message: 'An error occurred during check-in' });
    }
}




// // pages/api/check-in/check-in.js
// import { createClient } from '@supabase/supabase-js';
// import { verifyToken } from '@/utils/auth';

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: 'Method not allowed' });
//     }

//     try {
//         const user = verifyToken(req);
//         if (!user) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         const { name, email, location, branch, distanceToBranch, isWithin400Meters } = req.body;

//         const { data, error } = await supabase
//             .from('check_ins_duplicate')
//             .upsert(
//                 [{
//                     name: name,
//                     email: email,
//                     user_id: user.userId,
//                     location,
//                     branch,
//                     check_in_time: new Date(),
//                     distance_to_branch: distanceToBranch, // Store the distance to the branch
//                     within_400_meters: isWithin400Meters, // Store if the user was within 400 meters
//                 }],
//                 { 
//                     onConflict: ['id'], // Handle conflict on the 'id' column
//                     returning: 'minimal' // Optimize by not returning the entire row data
//                 }
//             );

//         if (error) throw error;

//         res.status(200).json({ message: 'Checked in successfully' });
//     } catch (error) {
//         console.error('Check-in error:', error);
//         res.status(500).json({ message: 'An error occurred during check-in' });
//     }
// }

