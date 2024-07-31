
// pages/api/check-in/check-out.js
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

        const { data, error } = await supabase
            .from('check_ins')
            .update({ check_out_time: new Date() })
            .match({ user_id: user.userId })

        if (error) throw error

        res.status(200).json({ message: 'Checked out successfully' })
    } catch (error) {
        console.error('Check-out error:', error)
        res.status(500).json({ message: 'An error occurred during check-out' })
    }
}