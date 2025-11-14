/**
 * Supabase Storage Setup Script
 * Creates the required storage bucket for multimodal file uploads
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupStorage() {
  console.log('🚀 Setting up Supabase Storage...\n')

  try {
    // Create borrower-documents bucket
    console.log('📦 Creating "borrower-documents" bucket...')

    const { data: bucket, error } = await supabase.storage.createBucket('borrower-documents', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
    })

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Bucket "borrower-documents" already exists')
      } else {
        throw error
      }
    } else {
      console.log('✅ Bucket "borrower-documents" created successfully')
    }

    // Verify bucket exists
    console.log('\n🔍 Verifying bucket configuration...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) throw listError

    const borrowerBucket = buckets.find(b => b.name === 'borrower-documents')

    if (borrowerBucket) {
      console.log('✅ Bucket verified:')
      console.log(`   - Name: ${borrowerBucket.name}`)
      console.log(`   - Public: ${borrowerBucket.public}`)
      console.log(`   - ID: ${borrowerBucket.id}`)
    }

    console.log('\n✨ Storage setup complete!')
    console.log('\nℹ️  Folder structure will be created automatically:')
    console.log('   - borrower-documents/business-photos/')
    console.log('   - borrower-documents/house-photos/')
    console.log('   - borrower-documents/field-notes/')

  } catch (error) {
    console.error('\n❌ Error setting up storage:', error)
    process.exit(1)
  }
}

setupStorage()
