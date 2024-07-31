// pages/api/auth/login.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { email, password } = req.body

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('Supabase Auth Error:', error)
            return res.status(401).json({ message: 'Invalid credentials', error: error.message })
        }

        const { user, session } = data


        // Fetch user data from your custom users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

            console.log(data)

        if (userError) {
            console.error('User Data Fetch Error:', userError)
            return res.status(500).json({ message: 'Error fetching user data', error: userError.message })
        }

        if (!userData.active) {
            return res.status(403).json({ message: 'User is not active' })
        }

        res.json({
            token: session.access_token,
            user: {
                id: user.id,
                email: user.email,
                name: userData.name,
                user_type: userData.user_type,
                slot_location: userData.slot_location,
                active: userData.active
            },
        })
    } catch (error) {
        console.error('Login Error:', error)
        res.status(500).json({ message: 'Error logging in', error: error.message })
    }
}