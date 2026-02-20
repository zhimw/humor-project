import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' // Import the new async client

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient() // Await the async client
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Success! Redirect to home page
      return NextResponse.redirect(`${origin}/`)
    }
  }

  // If something goes wrong, send them back home or to an error page
  return NextResponse.redirect(`${origin}/`)
}
