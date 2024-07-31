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

        const { location, branch } = req.body

        const { data, error } = await supabase
            .from('check_ins')
            .insert([
                { user_id: user.userId, location, branch, check_in_time: new Date() }
            ])

        if (error) throw error

        res.status(200).json({ message: 'Checked in successfully' })
    } catch (error) {
        console.error('Check-in error:', error)
        res.status(500).json({ message: 'An error occurred during check-in' })
    }
}