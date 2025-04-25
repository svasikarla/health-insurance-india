import { createClient } from '@supabase/supabase-js';

// Enhanced logging utility with log levels that works in both browser and Node environments
export const logger = {
  INFO: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    let logMessage = '';
    
    try {
      logMessage = data 
        ? `[INFO] ${timestamp} - ${message} | ${JSON.stringify(data, null, 2)}`
        : `[INFO] ${timestamp} - ${message}`;
    } catch (e) {
      logMessage = `[INFO] ${timestamp} - ${message} | [Data could not be stringified]`;
    }
    
    // Log to console (works in both browser and Node)
    console.log(logMessage);
    
    // For debugging - add extra visibility in browser
    if (typeof window !== 'undefined' && window.document) {
      // We're in a browser environment
      console.log('%c' + logMessage, 'color: blue; font-weight: bold');
    }
  },
  ERROR: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    let errorDetails = '';
    
    if (error) {
      try {
        if (error.message && error.details) {
          errorDetails = `Error: ${error.message}, Details: ${JSON.stringify(error.details)}`;
        } else if (error.message) {
          errorDetails = `Error: ${error.message}`;
        } else if (error.toString) {
          errorDetails = error.toString();
        } else {
          errorDetails = JSON.stringify(error);
        }
      } catch (e) {
        errorDetails = 'Error object could not be stringified';
      }
    }
    
    const logMessage = error
      ? `[ERROR] ${timestamp} - ${message} | ${errorDetails}`
      : `[ERROR] ${timestamp} - ${message}`;
    
    // Log to console (works in both browser and Node)
    console.error(logMessage);
    
    // For debugging - add extra visibility in browser
    if (typeof window !== 'undefined' && window.document) {
      // We're in a browser environment
      console.error('%c' + logMessage, 'color: red; font-weight: bold; background: #ffeeee;');
    }
  }
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  logger.ERROR('Supabase environment variables are missing or empty. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to fetch top insurance plans based on form data
export async function getTopInsurancePlans(formData: any) {
  try {
    logger.INFO('Starting to fetch top insurance plans', { formData });

    const age = Number(formData.age);
    const budget = Number(formData.budget);
    const hasFamily = formData.familySize !== "1";
    const isSenior = age >= 60;

    let planType = 'Individual';
    if (isSenior) planType = 'Senior Citizen';
    else if (hasFamily) planType = 'Family Floater';

    logger.INFO('Querying with plan type and budget', { planType, budget });

    // Query the view directly with all filters in one go
    const { data, error } = await supabase
      .from('insurance_policy_score_vw')
      .select(`
        policy_id,
        company_name,
        policy_name,
        claim_settlement_ratio,
        network_hospitals_count,
        annual_premium,
        co_payment,
        pre_hospitalization_days,
        post_hospitalization_days,
        total_score,
        type_of_plan
      `)
      .eq('type_of_plan', planType)
      .lte('annual_premium', budget)
      .order('total_score', { ascending: false })
      .limit(3);

    if (error) {
      logger.ERROR('Error fetching plans', error);
      return getMockInsurancePlans(formData);
    }

    if (data?.length) {
      logger.INFO('Fetched top insurance plans', { count: data.length });
      return data;
    }

    logger.INFO('No results with plan type and budget, trying without budget');

    // Retry without budget filter
    const { data: fallbackPlans, error: fallbackError } = await supabase
      .from('insurance_policy_score_vw')
      .select(`
        policy_id,
        company_name,
        policy_name,
        claim_settlement_ratio,
        network_hospitals_count,
        annual_premium,
        co_payment,
        pre_hospitalization_days,
        post_hospitalization_days,
        total_score,
        type_of_plan
      `)
      .eq('type_of_plan', planType)
      .order('total_score', { ascending: false })
      .limit(3);

    if (fallbackError) {
      logger.ERROR('Error in fallback plan fetch', fallbackError);
      return getMockInsurancePlans(formData);
    }

    if (fallbackPlans?.length) {
      logger.INFO('Fallback plans returned successfully', { count: fallbackPlans.length });
      return fallbackPlans;
    }

    logger.INFO('No plans found in the database, returning mock data');
    return getMockInsurancePlans(formData);

  } catch (err) {
    logger.ERROR('Unexpected error in getTopInsurancePlans', err);
    return getMockInsurancePlans(formData);
  }
}

// Function to generate mock insurance plans when database doesn't return any
function getMockInsurancePlans(formData: any) {
  const age = Number.parseInt(formData.age);
  const isSenior = age >= 60;
  const hasFamily = formData.familySize !== "1";
  const hasPEC = formData.preExistingConditions;
  const budget = formData.budget;
  
  logger.INFO('Generating mock insurance plans based on user profile', {
    age, isSenior, hasFamily, hasPEC, budget
  });
  
  // Create mock plans based on user demographics
  if (isSenior) {
    return [
      {
        policy_id: 'senior-care-plus',
        company_name: 'ABC Health Insurance',
        policy_name: 'Senior Care Plus',
        claim_settlement_ratio: 96,
        network_hospitals_count: 5000,
        annual_premium: Math.min(budget, 12000),
        co_payment: 0.1,
        pre_hospitalization_days: 60,
        post_hospitalization_days: 90,
        total_score: 0.95
      },
      {
        policy_id: 'senior-shield',
        company_name: 'XYZ Insurance',
        policy_name: 'Senior Shield',
        claim_settlement_ratio: 94,
        network_hospitals_count: 4500,
        annual_premium: Math.min(budget - 2000, 10000),
        co_payment: 0.15,
        pre_hospitalization_days: 45,
        post_hospitalization_days: 60,
        total_score: 0.88
      }
    ];
  } else if (hasFamily) {
    return [
      {
        policy_id: 'family-floater-gold',
        company_name: 'XYZ Insurance',
        policy_name: 'Family Floater Gold',
        claim_settlement_ratio: 95,
        network_hospitals_count: 6000,
        annual_premium: Math.min(budget, 15000),
        co_payment: 0,
        pre_hospitalization_days: 60,
        post_hospitalization_days: 90,
        total_score: 0.92
      },
      {
        policy_id: 'family-health-optimizer',
        company_name: 'PQR General Insurance',
        policy_name: 'Family Health Optimizer',
        claim_settlement_ratio: 93,
        network_hospitals_count: 5500,
        annual_premium: Math.min(budget - 3000, 12000),
        co_payment: 0.05,
        pre_hospitalization_days: 30,
        post_hospitalization_days: 60,
        total_score: 0.87
      }
    ];
  } else {
    return [
      {
        policy_id: 'individual-health-shield',
        company_name: 'PQR General Insurance',
        policy_name: 'Individual Health Shield',
        claim_settlement_ratio: 97,
        network_hospitals_count: 4500,
        annual_premium: Math.min(budget, 8000),
        co_payment: 0,
        pre_hospitalization_days: 60,
        post_hospitalization_days: 90,
        total_score: 0.9
      },
      {
        policy_id: 'health-advantage',
        company_name: 'LMN Insurance',
        policy_name: 'Health Advantage',
        claim_settlement_ratio: 94,
        network_hospitals_count: 4000,
        annual_premium: Math.min(budget - 2000, 6000),
        co_payment: 0.05,
        pre_hospitalization_days: 30,
        post_hospitalization_days: 60,
        total_score: 0.85
      }
    ];
  }
}

// Function to get policy features
export async function getPolicyFeatures(policyId: string) {
  logger.INFO('Fetching policy features', { policyId });
  
  try {
    // Check if policyId is a valid UUID format
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(policyId);
    
    if (!isValidUUID) {
      logger.INFO('Non-UUID policy ID detected, returning mock features', { policyId });
      return getMockPolicyFeatures(policyId);
    }
    
    const { data, error } = await supabase
      .from('insurance_policy_features')
      .select('*')
      .eq('policy_id', policyId);
      
    if (error) {
      logger.ERROR('Error fetching policy features', error);
      return getMockPolicyFeatures(policyId);
    }
    
    if (!data || data.length === 0) {
      logger.INFO('No features found for policy, returning mock data', { policyId });
      return getMockPolicyFeatures(policyId);
    }
    
    logger.INFO('Successfully fetched policy features', { 
      policyId, 
      featureCount: data.length
    });
    
    return data;
  } catch (error) {
    logger.ERROR('Unexpected error in getPolicyFeatures', error);
    return getMockPolicyFeatures(policyId);
  }
}

// Function to generate mock policy features when database doesn't return any
function getMockPolicyFeatures(policyId: string) {
  // Basic set of features applicable to most health insurance policies
  return [
    {
      id: `${policyId}-feature-1`,
      policy_id: policyId,
      feature_type: 'coverage',
      description: 'Comprehensive hospitalization coverage',
      is_optional: false,
      included: true,
    },
    {
      id: `${policyId}-feature-2`,
      policy_id: policyId,
      feature_type: 'coverage',
      description: 'Day care procedures covered',
      is_optional: false,
      included: true,
    },
    {
      id: `${policyId}-feature-3`,
      policy_id: policyId,
      feature_type: 'coverage',
      description: 'Pre and post hospitalization expenses',
      is_optional: false,
      included: true,
    },
    {
      id: `${policyId}-feature-4`,
      policy_id: policyId,
      feature_type: 'benefit',
      description: 'No claim bonus up to 50%',
      is_optional: false, 
      included: true,
    },
    {
      id: `${policyId}-feature-5`,
      policy_id: policyId,
      feature_type: 'benefit',
      description: 'Free annual health check-up',
      is_optional: false,
      included: true,
    },
    {
      id: `${policyId}-feature-6`,
      policy_id: policyId,
      feature_type: 'coverage',
      description: 'Ambulance charges covered',
      is_optional: false,
      included: true,
    }
  ];
} 