// pages/api/sales/index.js
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
        const { data: sales, error } = await supabase
            .from('sales')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        res.status(200).json(sales)
    } catch (error) {
        console.error('Error fetching sales records:', error)
        res.status(500).json({ message: 'Error fetching sales records' })
    }
}