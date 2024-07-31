
// // middleware/withAuth.js
// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'

// export function middleware(req) {
//     const res = NextResponse.next()
//     const supabase = createMiddlewareClient({ req, res })

//     return supabase.auth.getSession().then(({ data: { session } }) => {
//         if (!session) {
//             return new NextResponse(
//                 JSON.stringify({ message: 'Unauthorized' }),
//                 { status: 401, headers: { 'Content-Type': 'application/json' } }
//             )
//         }

//         return res
//     })
// }

// export const config = {
//     matcher: ['/api/protected/:path*'],
// }







// middleware/withAuth.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  return supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin (you'll need to adjust this based on your user data structure)
    if (session.user.user_metadata.userType !== 'admin') {
      return new NextResponse(
        JSON.stringify({ message: 'Forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return res
  })
}

export const config = {
  matcher: ['/api/users/:path*', '/api/check-ins', '/api/sales'],
}