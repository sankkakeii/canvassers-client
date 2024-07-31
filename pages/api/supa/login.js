// pages/api/auth/login.js
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { email, password } = req.body

    try {
        // Fetch user from Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()

        if (error || !user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }


        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // check if user is active
        if (!user.active) {
            return res.status(401).json({ message: 'User is not active, Please contact admin' })
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.NEXT_JWT_SECRET,
            { expiresIn: '1d' }
        )

        // Remove sensitive information from user object
        delete user.password

        res.status(200).json({ user, token })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'An error occurred during login' })
    }
}