
// pages/api/auth/create-admin.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email: 'admin@admin.com',
            password: 'admin',
            user_metadata: {
                name: 'admin',
                phone: 'admin',
                userType: 'admin',
                active: true,
            }
        })

        if (error) throw error

        res.status(201).json({ message: 'Admin user created successfully', admin: data.user })
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin user', error: error.message })
    }
}