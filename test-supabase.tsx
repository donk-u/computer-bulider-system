'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestSupabasePage() {
  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    console.log('=== Testing Supabase Connection ===')
    console.log('Environment check:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Missing environment variables!')
      return
    }

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      // Test 1: Fetch categories
      console.log('\n📊 Test 1: Fetching component categories...')
      const { data: categories, error: catError } = await supabase
        .from('component_categories')
        .select('*')
        .order('sort_order')

      if (catError) {
        console.error('❌ Error fetching categories:', catError)
      } else {
        console.log(`✅ Success! Found ${categories?.length || 0} categories`)
        console.log('Categories:', categories)
      }

      // Test 2: Fetch components
      console.log('\n🔧 Test 2: Fetching components...')
      const { data: components, error: compError } = await supabase
        .from('components')
        .select('*')
        .limit(5)

      if (compError) {
        console.error('❌ Error fetching components:', compError)
      } else {
        console.log(`✅ Success! Found ${components?.length || 0} components`)
        console.log('Components:', components)
      }

      // Test 3: Search function
      console.log('\n🔍 Test 3: Testing search function...')
      const { data: searchResults, error: searchError } = await supabase
        .rpc('search_components', {
          search_term: ''
        })

      if (searchError) {
        console.error('❌ Error with search function:', searchError)
      } else {
        console.log(`✅ Search function working! Found ${searchResults?.length || 0} components`)
      }

      console.log('\n✅ All tests completed!')
    } catch (error) {
      console.error('❌ Connection test failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
          <CardDescription>
            Check the browser console (F12) to see test results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-300 space-y-2">
            <p><strong>Environment Variables:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={testConnection}>Run Tests Again</Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">
              Open your browser's developer console (F12 or right-click → Inspect) to see detailed test results.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
