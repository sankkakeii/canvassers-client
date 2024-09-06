// pages/api/check-in/check-in.js
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '@/utils/auth'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const user = verifyToken(req)
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { name, email, location, branch, distanceToBranch, isWithin400Meters } = req.body

        const { data, error } = await supabase
            .from('canvassers_check_ins')
            .insert([
                {
                    name: name,
                    email: email,
                    user_id: user.userId,
                    location,
                    branch,
                    check_in_time: new Date(),
                    distance_to_branch: distanceToBranch, // Store the distance to the branch
                    within_400_meters: isWithin400Meters, // Store if the user was within 400 meters
                }
            ])

        if (error) throw error

        res.status(200).json({ message: 'Checked in successfully' })
    } catch (error) {
        console.error('Check-in error:', error)
        res.status(500).json({ message: 'An error occurred during check-in' })
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

