// pages/api/auth/register.js
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { email, password, name, phone } = req.body

    try {
        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insert new user
        const { data, error } = await supabase
            .from('users')
            .insert([
                { email, password: hashedPassword, name, phone }
            ])

        if (error) throw error

        res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ message: 'An error occurred during registration' })
    }
}