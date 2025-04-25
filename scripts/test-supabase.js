// Script to test Supabase connection and database setup
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log('\n🔍 TESTING SUPABASE CONNECTION AND DATABASE SETUP\n');
  
  // Test 1: Check connection
  try {
    console.log('Test 1: Checking connection to Supabase...');
    const { data, error } = await supabase.from('insurance_policies').select('count');
    
    if (error) throw error;
    
    console.log('✅ Successfully connected to Supabase!\n');
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('Make sure your Supabase credentials are correct and the service is running.');
    return;
  }
  
  // Test 2: Check insurance_policies table
  try {
    console.log('Test 2: Checking insurance_policies table...');
    const { data, error } = await supabase
      .from('insurance_policies')
      .select('*')
      .limit(5);
    
    if (error) throw error;
    
    if (data.length === 0) {
      console.log('⚠️ The insurance_policies table exists but has no data.');
    } else {
      console.log(`✅ Found ${data.length} records in insurance_policies table.`);
      console.log('Sample record:', JSON.stringify(data[0], null, 2));
      
      // Check the type_of_plan field
      const types = data.map(p => p.type_of_plan).filter(Boolean);
      if (types.length > 0) {
        console.log('Available plan types:', [...new Set(types)]);
      } else {
        console.log('⚠️ No type_of_plan values found in the sample.');
      }
    }
    console.log();
  } catch (error) {
    console.error('❌ insurance_policies table test failed:', error.message);
    console.error('The table might not exist or you may not have access.');
    return;
  }
  
  // Test 3: Check insurance_policy_score_vw view
  try {
    console.log('Test 3: Checking insurance_policy_score_vw view...');
    const { data, error } = await supabase
      .from('insurance_policy_score_vw')
      .select('*')
      .limit(5);
    
    if (error) throw error;
    
    if (data.length === 0) {
      console.log('⚠️ The insurance_policy_score_vw view exists but has no data.');
    } else {
      console.log(`✅ Found ${data.length} records in insurance_policy_score_vw view.`);
      console.log('Sample record:', JSON.stringify(data[0], null, 2));
      
      // Check that policy_id exists and matches format in insurance_policies
      if (data[0].policy_id) {
        console.log('policy_id format in view:', data[0].policy_id);
      } else {
        console.log('⚠️ No policy_id field found in the view.');
      }
    }
    console.log();
  } catch (error) {
    console.error('❌ insurance_policy_score_vw view test failed:', error.message);
    console.error('The view might not exist or you may not have access.');
    return;
  }
  
  // Test 4: Check policy features table
  try {
    console.log('Test 4: Checking insurance_policy_features table...');
    const { data, error } = await supabase
      .from('insurance_policy_features')
      .select('*')
      .limit(5);
    
    if (error) throw error;
    
    if (data.length === 0) {
      console.log('⚠️ The insurance_policy_features table exists but has no data.');
    } else {
      console.log(`✅ Found ${data.length} records in insurance_policy_features table.`);
      console.log('Sample record:', JSON.stringify(data[0], null, 2));
    }
    console.log();
  } catch (error) {
    console.error('❌ insurance_policy_features table test failed:', error.message);
    console.error('The table might not exist or you may not have access.');
    return;
  }
  
  // Test 5: Try the full query flow with a sample form data
  try {
    console.log('Test 5: Testing the full query flow...');
    
    // Sample form data
    const formData = {
      age: '35',
      familySize: '1',
      budget: 15000,
      preExistingConditions: false,
      coverageAmount: '5'
    };
    
    console.log('Using sample form data:', formData);
    
    // Step 1: Determine plan type (should be Individual based on the data)
    const planType = formData.familySize !== "1" ? 'Family Floater' : 
                     (Number.parseInt(formData.age) >= 60 ? 'Senior Citizen' : 'Individual');
    
    console.log('Determined plan type:', planType);
    
    // Step 2: Get policies of that type
    const { data: policies, error: policiesError } = await supabase
      .from('insurance_policies')
      .select('id, type_of_plan')
      .eq('type_of_plan', planType);
    
    if (policiesError) throw policiesError;
    
    if (!policies || policies.length === 0) {
      console.log(`⚠️ No policies found with type: ${planType}`);
      
      // Try to find any policies
      const { data: anyPolicies } = await supabase
        .from('insurance_policies')
        .select('id, type_of_plan')
        .limit(5);
        
      if (anyPolicies && anyPolicies.length > 0) {
        console.log('Available policies have these types:', anyPolicies.map(p => p.type_of_plan));
      }
      
      return;
    }
    
    const policyIds = policies.map(item => item.id);
    console.log(`Found ${policyIds.length} policies of type ${planType}. IDs:`, policyIds);
    
    // Step 3: Get plan scores for these IDs
    const { data: plans, error: plansError } = await supabase
      .from('insurance_policy_score_vw')
      .select(`
        policy_id,
        company_name,
        policy_name,
        annual_premium,
        total_score
      `)
      .in('policy_id', policyIds)
      .lte('annual_premium', formData.budget)
      .order('total_score', { ascending: false })
      .limit(3);
    
    if (plansError) throw plansError;
    
    if (!plans || plans.length === 0) {
      console.log('⚠️ No plans found matching the criteria with budget filter.');
      
      // Try without budget filter
      const { data: plansNoBudget } = await supabase
        .from('insurance_policy_score_vw')
        .select('policy_id, policy_name, annual_premium')
        .in('policy_id', policyIds)
        .limit(5);
        
      if (plansNoBudget && plansNoBudget.length > 0) {
        console.log('Plans available without budget filter:');
        console.log(plansNoBudget.map(p => ({
          id: p.policy_id,
          name: p.policy_name,
          premium: p.annual_premium
        })));
        
        if (plansNoBudget.every(p => p.annual_premium > formData.budget)) {
          console.log('All available plans exceed the budget of', formData.budget);
        }
      } else {
        console.log('No matching plans found even without budget filter.');
      }
      
      return;
    }
    
    console.log('✅ Successfully found matching plans:');
    console.log(plans.map(p => ({
      id: p.policy_id,
      name: p.policy_name,
      company: p.company_name,
      premium: p.annual_premium,
      score: p.total_score
    })));
    
    // Step 4: Check features for the first plan
    if (plans.length > 0) {
      const firstPlanId = plans[0].policy_id;
      console.log(`Checking features for plan ${firstPlanId}...`);
      
      const { data: features, error: featuresError } = await supabase
        .from('insurance_policy_features')
        .select('*')
        .eq('policy_id', firstPlanId);
        
      if (featuresError) throw featuresError;
      
      if (!features || features.length === 0) {
        console.log('⚠️ No features found for this plan.');
      } else {
        console.log(`✅ Found ${features.length} features for this plan.`);
        if (features.length > 0) {
          console.log('Sample feature:', features[0]);
        }
      }
    }
    
    console.log('\n✅ Full query flow completed successfully!');
  } catch (error) {
    console.error('❌ Full query flow test failed:', error.message);
    console.error('Details:', error);
  }
}

runTests().catch(err => {
  console.error('Test script failed with error:', err);
  process.exit(1);
}); 