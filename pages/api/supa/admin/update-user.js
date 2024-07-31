// pages/api/users/update-user.js
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '@/utils/auth'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
    const user = verifyToken(req)
    // if (!user) {
    //     return res.status(401).json({ message: 'Unauthorized' })
    // }

    if (req.method === 'PUT') {
        const { id, ...updateData } = req.body

        try {
            const { data, error } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', id)

            if (error) throw error

            res.status(200).json({ message: 'User updated successfully', data })
        } catch (error) {
            console.error('Update user error:', error)
            res.status(500).json({ message: 'An error occurred while updating the user' })
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}