// pages/api/auth/register.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    let active = true;

    try {
        const { email, password, name, phone, user_type = 'user', } = req.body


        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name, phone, user_type }
        })

        if (authError) throw authError

        // Insert user data into custom users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                name,
                phone,
                user_type,
                active,
                slot_location: ''
            })

        if (userError) throw userError

        res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ message: 'Error registering user', error: error.message })
    }
}




