// pages/api/users/index.js
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
        const { data: users, error } = await supabase
        .from('users')  // Replace 'Users' with the actual table name
        .select('*')

        if (error) throw error

        res.status(200).json(users)
    } catch (error) {
        console.error('Error fetching user records:', error)
        res.status(500).json({ message: 'Error fetching user records' })
    }
}