// pages/api/sales/record.js
import { supabase } from "@/utils/superbase";
import { verifyToken } from '@/utils/auth'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers.authorization.split(' ')[1];

    const { customerName, customerPhone, location, axaInsuranceCardSerial, customerRemark } = req.body;

    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { data, error } = await supabase
            .from('sales')
            .insert([{ user_id: user.userId, customer_name: customerName, customer_phone: customerPhone, location, axa_insurance_card_serial: axaInsuranceCardSerial, customer_remark: customerRemark }]);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Sale recorded successfully', data });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}
