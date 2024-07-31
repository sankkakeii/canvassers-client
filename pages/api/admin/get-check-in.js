// pages/api/check-ins/index.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { data: checkIns, error } = await supabase
            .from('check_ins')
            .select('*')
            .order('check_in_date_time', { ascending: false })

        if (error) throw error

        res.status(200).json(checkIns)
    } catch (error) {
        console.error('Error fetching check-in records:', error)
        res.status(500).json({ message: 'Error fetching check-in records' })
    }
}