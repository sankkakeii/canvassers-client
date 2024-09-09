// // pages/api/auth/login.js
// import { createClient } from '@supabase/supabase-js'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: 'Method not allowed' })
//     }

//     const { email, password } = req.body

//     try {
//         // Fetch user from Supabase
//         const { data: user, error } = await supabase
//             .from('users')
//             .select('*')
//             .eq('email', email)
//             .single()

//         if (error || !user) {
//             return res.status(401).json({ message: 'Invalid credentials' })
//         }


//         // Compare passwords
//         const passwordMatch = await bcrypt.compare(password, user.password)

//         if (!passwordMatch) {
//             return res.status(401).json({ message: 'Invalid credentials' })
//         }

//         // check if user is active
//         if (!user.active) {
//             return res.status(401).json({ message: 'User is not active, Please contact admin' })
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             { userId: user.id, email: user.email },
//             process.env.NEXT_JWT_SECRET,
//             { expiresIn: '1d' }
//         )

//         // Remove sensitive information from user object
//         delete user.password

//         res.status(200).json({ user, token })
//     } catch (error) {
//         console.error('Login error:', error)
//         res.status(500).json({ message: 'An error occurred during login' })
//     }
// }








// import { createClient } from '@supabase/supabase-js'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import { logActivity } from '@/utils/logger'

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         logActivity('ERROR', 'Invalid request method for login', { method: req.method });
//         return res.status(405).json({ message: 'Method not allowed' });
//     }

//     const { email, password } = req.body;

//     try {
//         // Fetch user from Supabase
//         const { data: user, error } = await supabase
//             .from('users')
//             .select('*')
//             .eq('email', email)
//             .single();

//         if (error || !user) {
//             logActivity('FAILURE', 'Invalid credentials', { email });
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Compare passwords
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             logActivity('FAILURE', 'Password mismatch', { email });
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Check if user is active
//         if (!user.active) {
//             logActivity('FAILURE', 'Inactive user attempted login', { email });
//             return res.status(401).json({ message: 'User is not active, Please contact admin' });
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             { userId: user.id, email: user.email },
//             process.env.NEXT_JWT_SECRET,
//             { expiresIn: '1d' }
//         );

//         // Remove sensitive information from user object
//         delete user.password;

//         logActivity('SUCCESS', 'User logged in successfully', { userId: user.id });
//         res.status(200).json({ user, token });
//     } catch (error) {
//         logActivity('ERROR', 'An error occurred during login', { error: error.message });
//         console.error('Login error:', error);
//         res.status(500).json({ message: 'An error occurred during login' });
//     }
// }













import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Logging function to write logs to a JSON file
const logActivity = (logType, message, additionalInfo = {}) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        logType,
        message,
        ...additionalInfo
    };

    const logFilePath = path.join(process.cwd(), 'logs', 'loginLogs.json');

    // Ensure the logs directory exists
    if (!fs.existsSync(path.dirname(logFilePath))) {
        fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    }

    // Read existing logs
    const existingLogs = fs.existsSync(logFilePath) ? JSON.parse(fs.readFileSync(logFilePath)) : [];

    // Append the new log entry
    existingLogs.push(logEntry);

    // Write the updated logs back to the file
    fs.writeFileSync(logFilePath, JSON.stringify(existingLogs, null, 2));
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        logActivity('ERROR', 'Invalid request method for login', { method: req.method });
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    try {
        // Fetch user from Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            logActivity('FAILURE', 'Invalid credentials', { email });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            logActivity('FAILURE', 'Password mismatch', { email });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.active) {
            logActivity('FAILURE', 'Inactive user attempted login', { email });
            return res.status(401).json({ message: 'User is not active, Please contact admin' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.NEXT_JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove sensitive information from user object
        delete user.password;

        logActivity('SUCCESS', 'User logged in successfully', { userId: user.id });
        res.status(200).json({ user, token });
    } catch (error) {
        logActivity('ERROR', 'An error occurred during login', { error: error.message });
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
}
