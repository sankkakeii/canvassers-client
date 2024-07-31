
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { id } = req.query  // This is how you access the dynamic part of the route
    const { active, slotLocation } = req.body

    if (slotLocation === undefined) {
        return res.status(400).json({ message: 'slotLocation is required' })
    }

    try {
        const { data: user, error } = await supabase
            .from('users')
            .update({
                active: active === undefined ? true : active,
                slot_location: slotLocation
            })
            .eq('id', id)
            .single()

        if (error) throw error

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User status updated successfully', user })
    } catch (error) {
        console.error('Error updating user status:', error)
        res.status(500).json({ message: 'Error updating user status', error: error.message })
    }
}