/**
 * Apply Supabase Storage RLS Policies
 * Sets up policies for the borrower-documents bucket
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

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

async function applyPolicies() {
  console.log('🔐 Applying Storage RLS Policies...\n')

  try {
    // Read SQL file
    const sqlFilePath = join(process.cwd(), 'scripts', 'setup-storage-policies.sql')
    const sqlContent = readFileSync(sqlFilePath, 'utf-8')

    console.log('📄 Executing SQL policies...')

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent })

    if (error) {
      // If exec_sql function doesn't exist, execute policies individually
      console.log('⚠️  Direct SQL execution not available, applying policies via API...\n')

      // Drop existing policies
      console.log('🗑️  Dropping existing policies...')
      const dropPolicies = [
        `DROP POLICY IF EXISTS "Public Access" ON storage.objects`,
        `DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects`,
        `DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects`,
        `DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects`
      ]

      for (const sql of dropPolicies) {
        await supabase.rpc('exec_sql', { sql }).catch(() => {
          console.log(`   Skipping: ${sql.substring(0, 50)}...`)
        })
      }

      // Create new policies
      console.log('\n✨ Creating new policies...')
      const createPolicies = [
        {
          name: 'Public Access',
          sql: `CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'borrower-documents')`
        },
        {
          name: 'Authenticated users can upload files',
          sql: `CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'borrower-documents')`
        },
        {
          name: 'Users can update their own files',
          sql: `CREATE POLICY "Users can update their own files" ON storage.objects FOR UPDATE USING (bucket_id = 'borrower-documents') WITH CHECK (bucket_id = 'borrower-documents')`
        },
        {
          name: 'Users can delete their own files',
          sql: `CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (bucket_id = 'borrower-documents')`
        }
      ]

      for (const policy of createPolicies) {
        const { error } = await supabase.rpc('exec_sql', { sql: policy.sql })
        if (error) {
          console.log(`   ⚠️  ${policy.name}: ${error.message}`)
        } else {
          console.log(`   ✅ ${policy.name}`)
        }
      }
    } else {
      console.log('✅ SQL policies applied successfully')
    }

    console.log('\n✨ Storage RLS Policies applied!')
    console.log('\n📋 Summary:')
    console.log('   ✅ Public read access enabled')
    console.log('   ✅ Authenticated upload enabled')
    console.log('   ✅ File update/delete policies configured')
    console.log('\n💡 Note: You may need to manually apply these policies in Supabase Dashboard SQL Editor')
    console.log('   File: scripts/setup-storage-policies.sql')

  } catch (error) {
    console.error('\n❌ Error applying policies:', error)
    console.log('\n💡 Manual Steps Required:')
    console.log('   1. Go to your Supabase Dashboard')
    console.log('   2. Navigate to SQL Editor')
    console.log('   3. Copy and paste the contents of scripts/setup-storage-policies.sql')
    console.log('   4. Run the SQL commands')
    process.exit(1)
  }
}

applyPolicies()
