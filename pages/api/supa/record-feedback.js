// pages/api/sales/record.js
import { supabase } from "@/utils/superbase";
import { verifyToken } from '@/utils/auth'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers.authorization.split(' ')[1];

    const { feedback  } = req.body;

    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log(feedback);

    try {
        const { data, error } = await supabase
            .from('feedback')
            .insert([{ user_id: user.userId, feedback: feedback }]);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Feedaback recorded successfully', data });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}
