// pages/api/sales/record.js
import { supabase } from "@/utils/superbase";
import { verifyToken } from '@/utils/auth'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { feedbackData } = req.body;

    const user = verifyToken(req);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }


    try {
        const { data, error } = await supabase
            .from('feedback_duplicate')
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
            throw error;
        }

        res.status(200).json({ message: 'Feedaback recorded successfully', data });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}
