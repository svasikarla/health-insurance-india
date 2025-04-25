"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Shield, Star } from "lucide-react"
import { PolicySummary } from "./policy-bare-open/policy-summary"
import { ScenarioBasedLearning } from "./policy-bare-open/scenario-based-learning"
import { VisualRiskCalculator } from "./policy-bare-open/visual-risk-calculator"
import { RedFlagHighlights } from "./policy-bare-open/red-flag-highlights"
import { VisualClauseMap } from "./policy-bare-open/visual-clause-map"
import { getTopInsurancePlans, getPolicyFeatures } from "@/lib/supabase"

type FormData = {
  age: string
  gender: string
  location: string
  familySize: string
  preExistingConditions: boolean
  budget: number
  coverageAmount: string
}

type PlanRecommendationProps = {
  formData: FormData
  onReset: () => void
}

// Define InsurancePlan type to match the DB structure
type InsurancePlan = {
  policy_id: string
  company_name: string
  policy_name: string
  claim_settlement_ratio: number
  network_hospitals_count: number
  annual_premium: number
  co_payment: number
  pre_hospitalization_days: number
  post_hospitalization_days: number
  total_score: number
}

// Define PolicyFeature type
type PolicyFeature = {
  id: string
  policy_id: string
  feature_type: string
  description: string
  is_optional: boolean
  included: boolean
}

export function PlanRecommendation({ formData, onReset }: PlanRecommendationProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("recommended")
  const [loading, setLoading] = useState(true)
  const [recommendedPlans, setRecommendedPlans] = useState<InsurancePlan[]>([])
  const [policyFeatures, setPolicyFeatures] = useState<Record<string, PolicyFeature[]>>({})

  // Fetch plans from Supabase
  useEffect(() => {
    async function fetchPlans() {
      setLoading(true)
      try {
        // Validate required form data
        if (!formData || !formData.age || !formData.budget || !formData.coverageAmount) {
          console.error("Invalid form data:", formData)
          setRecommendedPlans([])
          setLoading(false)
          return
        }
        
        // Ensure budget is a valid number
        const budget = Number(formData.budget)
        if (isNaN(budget) || budget <= 0) {
          console.error("Invalid budget value:", formData.budget)
          setRecommendedPlans([])
          setLoading(false)
          return
        }
        
        // Fetch insurance plans with valid data
        console.log("Fetching plans with formData:", JSON.stringify(formData, null, 2))
        
        // Added console statement to check Supabase URL
        console.log(
          "%cSupabase connection info", 
          "color: purple; font-weight: bold; font-size: 14px",
          {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
            keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length : 0
          }
        )
        
        const plans = await getTopInsurancePlans(formData)
        
        // Log the results clearly in browser console for debugging
        console.log(
          "%cFetched plans: " + (plans?.length || 0), 
          "color: green; font-weight: bold; font-size: 14px"
        )
        if (plans?.length > 0) {
          console.table(plans.map(p => ({
            id: p.policy_id,
            name: p.policy_name,
            company: p.company_name,
            premium: p.annual_premium,
            score: p.total_score
          })))
          
          // Successfully fetched plans, store them
          setRecommendedPlans(plans)
          
          // Fetch features for each plan
          try {
            const featuresMap: Record<string, PolicyFeature[]> = {}
            for (const plan of plans) {
              console.log(`Fetching features for policy ${plan.policy_id}`)
              const features = await getPolicyFeatures(plan.policy_id)
              
              if (features?.length > 0) {
                console.log(`Found ${features.length} features for policy ${plan.policy_id}`)
                console.table(features.slice(0, 3)) // Log first few features
              } else {
                console.log(`No features found for policy ${plan.policy_id}, using mock features`)
              }
              
              featuresMap[plan.policy_id] = features || []
            }
            setPolicyFeatures(featuresMap)
          } catch (featureError) {
            console.error("Error fetching policy features:", featureError)
            // Continue with empty features rather than failing completely
          }
        } else {
          console.log("%cNo plans returned from database - will use fallback data", 
            "color: orange; font-weight: bold; font-size: 14px"
          )
          console.log("%cCheck console errors above for Supabase connection issues", 
            "color: red; font-weight: bold"
          )
          setRecommendedPlans([])
        }
      } catch (error) {
        console.error("Error fetching plans:", error)
        // Set empty data array if API fails
        setRecommendedPlans([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPlans()
  }, [formData])

  // Transform DB plan data to the format expected by the UI
  const transformPlanToUIFormat = (plan: InsurancePlan, index: number) => {
    const features = policyFeatures[plan.policy_id] || []
    
    return {
      name: plan.policy_name,
      provider: plan.company_name,
      premium: `₹${plan.annual_premium.toLocaleString()}/year`,
      coverage: `₹${Number(formData.coverageAmount)} Lakhs`,
      suitabilityScore: Math.round(plan.total_score * 100), // Convert score to percentage
      keyFeatures: features.map(feature => feature.description).filter(Boolean).slice(0, 5),
      whyRecommended: [
        `High claim settlement ratio of ${plan.claim_settlement_ratio}%`,
        `Access to ${plan.network_hospitals_count.toLocaleString()}+ network hospitals`,
        `${plan.pre_hospitalization_days} days pre-hospitalization coverage`,
        `${plan.post_hospitalization_days} days post-hospitalization coverage`,
      ],
      educationalContent: [
        {
          title: index === 0 ? "Why This Is Your Top Match" : "About This Plan",
          content: `This plan has a score of ${Math.round(plan.total_score * 100)}% based on your requirements. It offers a good balance of coverage and affordability with an annual premium of ₹${plan.annual_premium.toLocaleString()}.`,
        },
        {
          title: "Co-payment Details",
          content: plan.co_payment > 0 
            ? `This plan has a co-payment clause of ${plan.co_payment * 100}%, meaning you pay this percentage of any claim amount.` 
            : "This plan has no co-payment requirement, which means the insurer covers the entire approved claim amount.",
        },
        {
          title: "Hospitalization Coverage",
          content: `This plan covers medical expenses ${plan.pre_hospitalization_days} days before hospitalization and ${plan.post_hospitalization_days} days after discharge.`,
        },
      ],
    }
  }

  // Get fallback data in case of API errors
  const getFallbackRecommendedPlan = () => {
    const age = Number.parseInt(formData.age)
    const isSenior = age >= 60
    const hasFamily = formData.familySize !== "1"
    const hasPEC = formData.preExistingConditions
    const budget = formData.budget
    const coverageAmount = Number.parseInt(formData.coverageAmount)

    // Simple recommendation logic
    if (isSenior) {
      return {
        name: "Senior Care Plus",
        provider: "ABC Health Insurance",
        premium: "₹" + Math.min(budget, 12000).toLocaleString() + "/year",
        coverage: "₹" + formData.coverageAmount + " Lakhs",
        suitabilityScore: 95,
        keyFeatures: [
          "Specialized coverage for senior citizens",
          "No medical check-up required up to age 65",
          "Coverage for pre-existing diseases after 1 year",
          "Covers 30+ critical illnesses",
          "Free health check-up every year",
        ],
        whyRecommended: [
          "Tailored for seniors with comprehensive coverage",
          "Includes coverage for age-related conditions",
          "Affordable premium within your budget",
          "Cashless treatment at 5000+ network hospitals",
        ],
        educationalContent: [
          {
            title: "What is Senior Care Insurance?",
            content:
              "Senior Care insurance is specifically designed for individuals aged 60 and above. It provides coverage for hospitalization expenses, pre and post hospitalization care, and often includes benefits like domiciliary treatment and regular health check-ups.",
          },
          {
            title: "Pre-Existing Conditions Coverage",
            content:
              "Most senior care policies cover pre-existing conditions after a waiting period of 1-2 years. This means conditions you already have will be covered after this initial waiting period.",
          },
          {
            title: "Co-Payment Clause",
            content:
              "Many senior citizen health policies have a co-payment clause, which means you pay a percentage of the claim amount (usually 10-20%). This helps keep the premium affordable.",
          },
        ],
      }
    } else if (hasFamily) {
      return {
        name: "Family Floater Gold",
        provider: "XYZ Insurance",
        premium: "₹" + Math.min(budget, 15000).toLocaleString() + "/year",
        coverage: "₹" + formData.coverageAmount + " Lakhs",
        suitabilityScore: 92,
        keyFeatures: [
          "Coverage for entire family under single sum insured",
          "Maternity benefits included",
          "Coverage for 30+ critical illnesses",
          "Free health check-up every year",
          "No claim bonus up to 50%",
        ],
        whyRecommended: [
          "Perfect for families with comprehensive coverage",
          "Includes child care benefits",
          "Maternity coverage with newborn baby expenses",
          "Cashless treatment at 6000+ network hospitals",
        ],
        educationalContent: [
          {
            title: "What is a Family Floater Policy?",
            content:
              "A family floater health insurance policy covers your entire family under a single sum insured. The premium is based on the age of the oldest member. This is usually more cost-effective than individual policies for each family member.",
          },
          {
            title: "How Sum Insured Works in Family Floater",
            content:
              "The sum insured is shared among all family members. For example, if you have a ₹10 lakh policy, any family member can claim up to ₹10 lakhs, but the total claims by all members cannot exceed ₹10 lakhs in a policy year.",
          },
          {
            title: "No Claim Bonus Benefit",
            content:
              "If no claims are made during a policy year, you receive a No Claim Bonus, which increases your sum insured for the next year (typically by 5-50%) without any increase in premium.",
          },
        ],
      }
    } else {
      return {
        name: "Individual Health Shield",
        provider: "PQR General Insurance",
        premium: "₹" + Math.min(budget, 8000).toLocaleString() + "/year",
        coverage: "₹" + formData.coverageAmount + " Lakhs",
        suitabilityScore: 90,
        keyFeatures: [
          "Comprehensive individual coverage",
          "Day care procedures covered",
          "Coverage for pre and post hospitalization expenses",
          "Free annual health check-up",
          "No claim bonus up to 50%",
        ],
        whyRecommended: [
          "Tailored for individual needs with comprehensive coverage",
          "Affordable premium within your budget",
          "Excellent for young professionals",
          "Cashless treatment at 4500+ network hospitals",
        ],
        educationalContent: [
          {
            title: "What is Individual Health Insurance?",
            content:
              "Individual health insurance provides coverage for a single person. The premium is based on your age, health condition, and the sum insured you choose. It's ideal for single individuals or those who want personalized coverage.",
          },
          {
            title: "Waiting Period Explained",
            content:
              "Most health insurance policies have waiting periods for specific conditions. Typically, there's a 30-day initial waiting period for all illnesses except accidents, and a 2-4 year waiting period for pre-existing conditions.",
          },
          {
            title: "Claim Process Simplified",
            content:
              "For cashless claims, you need to get admitted to a network hospital and inform the insurance company. For reimbursement claims, you pay the hospital bills first and then submit the documents to the insurer for reimbursement.",
          },
        ],
      }
    }
  }

  // Get the main recommended plan (first in the list)
  const recommendedPlan = recommendedPlans.length > 0
    ? transformPlanToUIFormat(recommendedPlans[0], 0)
    : getFallbackRecommendedPlan()

  // Get alternative plans (2nd and 3rd in the list)
  const alternativePlans = recommendedPlans.length > 1
    ? recommendedPlans.slice(1).map((plan, index) => transformPlanToUIFormat(plan, index + 1))
    : [
        {
          name: "Value Health Plan",
          provider: "LMN Insurance",
          premium: "₹" + Math.max(formData.budget - 3000, 5000).toLocaleString() + "/year",
          coverage: "₹" + (Number.parseInt(formData.coverageAmount) - 2) + " Lakhs",
          suitabilityScore: 85,
          keyFeatures: [
            "Basic hospitalization coverage",
            "Day care procedures covered",
            "Ambulance charges covered",
            "Tax benefits under Section 80D",
          ],
        },
        {
          name: "Premium Health Max",
          provider: "DEF Health Insurance",
          premium: "₹" + Math.min(formData.budget + 5000, 50000).toLocaleString() + "/year",
          coverage: "₹" + (Number.parseInt(formData.coverageAmount) + 5) + " Lakhs",
          suitabilityScore: 88,
          keyFeatures: [
            "Enhanced coverage with premium benefits",
            "International emergency coverage",
            "Alternative treatments covered (Ayurveda, Homeopathy)",
            "Restoration of sum insured benefit",
          ],
        },
      ]

  // Transform the recommended plan data into the format expected by the Policy Bare Open components
  const transformRecommendedPlanToPolicyData = () => {
    // Extract plan name, provider, premium, and coverage
    const planName = recommendedPlan.name || "Comprehensive Health Shield"
    const provider = recommendedPlan.provider || "ABC Insurance"
    const premium = recommendedPlan.premium || "₹12,000/year"
    const sumInsured = recommendedPlan.coverage || "₹5,00,000"

    // Transform key features into policy clauses
    type PolicyClause = {
      id: string;
      title: string;
      category: string;
      description: string;
      isRedFlag: boolean;
      implication: string;
    }
    
    const clauses: PolicyClause[] = []

    // Map features to clauses with appropriate categories and red flags
    if (recommendedPlan.keyFeatures && Array.isArray(recommendedPlan.keyFeatures)) {
      recommendedPlan.keyFeatures.forEach((feature: string, index: number) => {
        // Determine clause category and details based on feature text
        let category = "coverage"
        let isRedFlag = false
        let description = feature
        let implication = ""

        // Analyze feature text to categorize and determine if it's a red flag
        if (feature.toLowerCase().includes("pre-existing")) {
          category = "coverage"
          isRedFlag = true
          description = feature.includes("after") ? feature : `${feature} after waiting period`
          implication = "You'll need to wait before pre-existing conditions are covered."
        } else if (feature.toLowerCase().includes("day care")) {
          category = "treatment"
          isRedFlag = false
          implication = "Minor procedures that don't require 24-hour hospitalization are covered."
        } else if (feature.toLowerCase().includes("hospitalization")) {
          category = "hospitalization"
          isRedFlag = false
          implication = "Your hospital stay expenses will be covered as per policy terms."
        } else if (feature.toLowerCase().includes("check-up")) {
          category = "bonus"
          isRedFlag = false
          implication = "You can get preventive health check-ups at no additional cost."
        } else if (feature.toLowerCase().includes("bonus")) {
          category = "bonus"
          isRedFlag = false
          implication = "Your coverage amount increases if you don't make claims."
        } else if (feature.toLowerCase().includes("ambulance")) {
          category = "transportation"
          isRedFlag = false
          implication = "Emergency ambulance charges will be covered up to a certain limit."
        } else if (feature.toLowerCase().includes("co-payment") || feature.toLowerCase().includes("copay")) {
          category = "payment"
          isRedFlag = true
          implication = "You'll need to pay a percentage of the claim amount from your pocket."
        } else if (feature.toLowerCase().includes("room")) {
          category = "hospitalization"
          isRedFlag = true
          implication = "If you choose a higher category room, you'll need to pay the difference."
        } else if (feature.toLowerCase().includes("critical")) {
          category = "treatment"
          isRedFlag = false
          implication = "Specified critical illnesses are covered under this policy."
        } else if (feature.toLowerCase().includes("maternity")) {
          category = "treatment"
          isRedFlag = false
          implication = "Expenses related to childbirth and maternity care are covered."
        }

        // Create the clause object
        clauses.push({
          id: (index + 1).toString(),
          title: feature.split(":")[0] || feature.substring(0, 30),
          description: description,
          implication: implication || "This feature affects your coverage as described.",
          category: category,
          isRedFlag: isRedFlag,
        })
      })
    }

    // Add standard clauses that are common in health insurance
    const standardClauses = [
      {
        id: (clauses.length + 1).toString(),
        title: "Room Rent Limit",
        description: "₹5,000/day or 1% of sum insured, whichever is lower",
        implication:
          "If your hospital room costs more than the limit, you will have to pay the difference from your pocket.",
        category: "hospitalization",
        isRedFlag: true,
      },
      {
        id: (clauses.length + 2).toString(),
        title: "Waiting Period",
        description: "2 years for pre-existing diseases",
        implication:
          "If you have pre-existing conditions and need treatment within 2 years of buying the policy, it won't be covered.",
        category: "coverage",
        isRedFlag: true,
      },
      {
        id: (clauses.length + 3).toString(),
        title: "Co-payment",
        description: "20% for senior citizens",
        implication: "If you're above 60 years and have a claim of ₹1 lakh, you'll need to pay ₹20,000 yourself.",
        category: "payment",
        isRedFlag: true,
      },
      {
        id: (clauses.length + 4).toString(),
        title: "Sub-limits on Treatments",
        description: "Cataract surgery: ₹40,000",
        implication: "If your cataract surgery costs ₹60,000, you'll have to pay ₹20,000 from your pocket.",
        category: "treatment",
        isRedFlag: true,
      },
      {
        id: (clauses.length + 5).toString(),
        title: "Ambulance Cover",
        description: "₹2,000 per hospitalization",
        implication: "If your ambulance costs ₹3,500, you'll have to pay ₹1,500 from your pocket.",
        category: "transportation",
        isRedFlag: false,
      },
      {
        id: (clauses.length + 6).toString(),
        title: "No Claim Bonus",
        description: "10% increase in sum insured for each claim-free year",
        implication: "If you don't make any claims this year, your coverage will increase to ₹5.5 lakhs next year.",
        category: "bonus",
        isRedFlag: false,
      },
      {
        id: (clauses.length + 7).toString(),
        title: "Pre & Post Hospitalization",
        description: "30 days pre and 60 days post hospitalization",
        implication: "Medical expenses 30 days before and 60 days after hospitalization will be covered.",
        category: "hospitalization",
        isRedFlag: false,
      },
      {
        id: (clauses.length + 8).toString(),
        title: "Restoration Benefit",
        description: "100% restoration of sum insured once per year",
        implication: "If you exhaust your coverage, it will be fully restored for future claims in the same year.",
        category: "coverage",
        isRedFlag: false,
      },
    ]

    // Add standard clauses that aren't already covered by the plan features
    standardClauses.forEach((clause) => {
      // Check if this type of clause is already in our clauses array
      const exists = clauses.some(
        (c) =>
          c.title.toLowerCase().includes(clause.title.toLowerCase()) ||
          clause.title.toLowerCase().includes(c.title.toLowerCase()),
      )

      if (!exists) {
        clauses.push(clause)
      }
    })

    // Create scenarios based on the plan
    const coverageAmount = Number.parseInt(sumInsured.replace(/[^\d]/g, "")) || 500000
    const scenarios = [
      {
        id: "scenario1",
        title: "5-day Hospital Stay",
        description: "Regular room, basic treatment, no surgery",
        baseCost: 75000,
        coverageDetails: [
          {
            item: "Room charges (₹10,000/day × 5)",
            amount: 50000,
            covered: 25000,
            notes: "Room rent limit: ₹5,000/day",
          },
          { item: "Doctor visits", amount: 10000, covered: 10000, notes: "Fully covered" },
          { item: "Medicines & consumables", amount: 8000, covered: 8000, notes: "Fully covered" },
          { item: "Diagnostic tests", amount: 7000, covered: 7000, notes: "Fully covered" },
        ],
      },
      {
        id: "scenario2",
        title: "Major Surgery",
        description: "Includes pre-op tests, surgery, and 3-day ICU stay",
        baseCost: Math.min(250000, coverageAmount),
        coverageDetails: [
          {
            item: "Surgery charges",
            amount: Math.min(150000, coverageAmount * 0.6),
            covered: Math.min(150000, coverageAmount * 0.6),
            notes: "Fully covered",
          },
          {
            item: "ICU charges (₹15,000/day × 3)",
            amount: 45000,
            covered: 45000,
            notes: "ICU fully covered",
          },
          {
            item: "Surgeon & anesthetist fees",
            amount: Math.min(35000, coverageAmount * 0.14),
            covered: Math.min(35000, coverageAmount * 0.14),
            notes: "Fully covered",
          },
          {
            item: "Medicines & consumables",
            amount: Math.min(20000, coverageAmount * 0.08),
            covered: Math.min(20000, coverageAmount * 0.08),
            notes: "Fully covered",
          },
        ],
      },
      {
        id: "scenario3",
        title: "Dialysis Treatment",
        description: "Regular dialysis sessions over 3 months",
        baseCost: Math.min(180000, coverageAmount * 0.36),
        coverageDetails: [
          {
            item: "Dialysis sessions (24 sessions)",
            amount: Math.min(144000, coverageAmount * 0.288),
            covered: Math.min(144000, coverageAmount * 0.288),
            notes: "Fully covered",
          },
          {
            item: "Medicines",
            amount: Math.min(20000, coverageAmount * 0.04),
            covered: Math.min(20000, coverageAmount * 0.04),
            notes: "Fully covered",
          },
          {
            item: "Doctor consultations",
            amount: Math.min(16000, coverageAmount * 0.032),
            covered: Math.min(16000, coverageAmount * 0.032),
            notes: "Fully covered",
          },
        ],
      },
    ]

    // Create the transformed policy data
    return {
      name: planName,
      provider: provider,
      premium: premium,
      sumInsured: sumInsured,
      clauses: clauses,
      scenarios: scenarios,
    }
  }

  const policyData = transformRecommendedPlanToPolicyData()

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Finding Your Best Plans</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Please wait while we analyze your preferences to find the perfect insurance plans for you...
              </p>
            </div>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Your Personalized Recommendation
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Based on your information, we've found the perfect health insurance plan for you
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl">
          <Tabs defaultValue="recommended">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="recommended">Recommended Plan</TabsTrigger>
              <TabsTrigger value="policy-summary">Policy Summary</TabsTrigger>
              <TabsTrigger value="scenarios">Scenario Learning</TabsTrigger>
              <TabsTrigger value="risk-calculator">Risk Calculator</TabsTrigger>
              <TabsTrigger value="red-flags">Red Flags</TabsTrigger>
              <TabsTrigger value="clause-map">Clause Map</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="mt-6">
              <Card className="border-2 border-primary">
                <CardHeader className="bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center">
                        <Star className="h-6 w-6 text-yellow-500 mr-2 inline" />
                        {recommendedPlan.name}
                      </CardTitle>
                      <CardDescription className="text-base mt-1">{recommendedPlan.provider}</CardDescription>
                    </div>
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {recommendedPlan.suitabilityScore}% Match
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Plan Details</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Premium:</span>
                          <span className="font-bold">{recommendedPlan.premium}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Coverage:</span>
                          <span className="font-bold">{recommendedPlan.coverage}</span>
                        </div>
                        <div className="pt-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Key Features</h4>
                          <ul className="space-y-2">
                            {recommendedPlan.keyFeatures.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Why We Recommend This</h3>
                      <ul className="space-y-2">
                        {recommendedPlan.whyRecommended.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-3">Alternative Plans</h3>
                        <div className="space-y-4">
                          {alternativePlans.map((plan, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <h4 className="font-medium">{plan.name}</h4>
                                  <p className="text-sm text-gray-500">{plan.provider}</p>
                                </div>
                                <div className="text-sm bg-muted px-2 py-1 rounded-full">
                                  {plan.suitabilityScore}% Match
                                </div>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>
                                  Premium: <span className="font-medium">{plan.premium}</span>
                                </span>
                                <span>
                                  Coverage: <span className="font-medium">{plan.coverage}</span>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/50 px-6 py-4">
                  <Button variant="outline" onClick={onReset}>
                    Start Over
                  </Button>
                  <div className="text-sm text-gray-500">Explore the other tabs to learn more about this policy</div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="policy-summary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Policy Summary</CardTitle>
                  <CardDescription>
                    Swipe through policy clauses to understand what's covered and what's not
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PolicySummary policyData={policyData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scenarios" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scenario-Based Learning</CardTitle>
                  <CardDescription>See how this policy would cover different medical scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScenarioBasedLearning policyData={policyData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk-calculator" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Risk Calculator</CardTitle>
                  <CardDescription>Assess how well this policy matches your risk profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <VisualRiskCalculator policyData={policyData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="red-flags" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Red Flag Highlights</CardTitle>
                  <CardDescription>
                    Potential issues in the policy that could lead to unexpected expenses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RedFlagHighlights policyData={policyData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clause-map" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Clause Map</CardTitle>
                  <CardDescription>Visualize how different policy clauses relate to each other</CardDescription>
                </CardHeader>
                <CardContent>
                  <VisualClauseMap policyData={policyData} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
