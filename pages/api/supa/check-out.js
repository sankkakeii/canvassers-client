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

        const { checkOutInformation } = req.body
        console.log('Check-out information received on server:', checkOutInformation)

        // Fetch the latest check-in entry for the user
        const { data: checkInData, error: fetchError } = await supabase
            .from('check_ins')
            .select('id')
            .eq('user_id', user.userId)
            .order('check_in_time', { ascending: false })
            .limit(1)
            .single()

        if (fetchError) throw fetchError
        if (!checkInData) {
            return res.status(404).json({ message: 'No check-in entry found for the user' })
        }

        // Update the latest check-in entry with the check-out information
        const { data, error } = await supabase
            .from('check_ins')
            .update({
                check_out_information: checkOutInformation, // Store check-out information
            })
            .eq('id', checkInData.id) // Update only the latest check-in entry

        if (error) throw error

        res.status(200).json({ message: 'Checked out successfully' })
    } catch (error) {
        console.error('Check-out error:', error)
        res.status(500).json({ message: 'An error occurred during check-out' })
    }
}
