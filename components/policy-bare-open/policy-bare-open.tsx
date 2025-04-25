"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PolicySummary } from "./policy-summary"
import { ScenarioBasedLearning } from "./scenario-based-learning"
import { VisualRiskCalculator } from "./visual-risk-calculator"
import { RedFlagHighlights } from "./red-flag-highlights"
import { VisualClauseMap } from "./visual-clause-map"

type PolicyBareOpenProps = {
  recommendedPlan?: any
}

export function PolicyBareOpen({ recommendedPlan }: PolicyBareOpenProps) {
  const [activeTab, setActiveTab] = useState("summary")
  const [policyData, setPolicyData] = useState<any>(null)

  // Initialize policy data based on recommended plan or default data
  useEffect(() => {
    if (recommendedPlan) {
      // Transform the recommended plan data into the format expected by the components

      // Extract plan name, provider, premium, and coverage
      const planName = recommendedPlan.name || "Comprehensive Health Shield"
      const provider = recommendedPlan.provider || "ABC Insurance"
      const premium = recommendedPlan.premium || "₹12,000/year"
      const sumInsured = recommendedPlan.coverage || "₹5,00,000"

      // Transform key features into policy clauses
      const clauses = []

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
      const transformedData = {
        name: planName,
        provider: provider,
        premium: premium,
        sumInsured: sumInsured,
        clauses: clauses,
        scenarios: scenarios,
      }

      setPolicyData(transformedData)
    } else {
      // Default policy data if no recommended plan is provided
      setPolicyData({
        name: "Comprehensive Health Shield",
        provider: "ABC Insurance",
        premium: "₹12,000/year",
        sumInsured: "₹5,00,000",
        clauses: [
          {
            id: "1",
            title: "Room Rent Limit",
            description: "₹5,000/day",
            implication: "If your hospital room costs ₹10,000/day, you will have to pay ₹5,000/day from your pocket.",
            category: "hospitalization",
            isRedFlag: true,
          },
          {
            id: "2",
            title: "Waiting Period",
            description: "2 years for pre-existing diseases",
            implication:
              "If you have diabetes and need treatment within 2 years of buying the policy, it won't be covered.",
            category: "coverage",
            isRedFlag: true,
          },
          {
            id: "3",
            title: "Co-payment",
            description: "20% for senior citizens",
            implication: "If you're above 60 years and have a claim of ₹1 lakh, you'll need to pay ₹20,000 yourself.",
            category: "payment",
            isRedFlag: true,
          },
          {
            id: "4",
            title: "Sub-limits on Treatments",
            description: "Cataract surgery: ₹40,000",
            implication: "If your cataract surgery costs ₹60,000, you'll have to pay ₹20,000 from your pocket.",
            category: "treatment",
            isRedFlag: true,
          },
          {
            id: "5",
            title: "Ambulance Cover",
            description: "₹2,000 per hospitalization",
            implication: "If your ambulance costs ₹3,500, you'll have to pay ₹1,500 from your pocket.",
            category: "transportation",
            isRedFlag: false,
          },
          {
            id: "6",
            title: "No Claim Bonus",
            description: "10% increase in sum insured for each claim-free year",
            implication: "If you don't make any claims this year, your coverage will increase to ₹5.5 lakhs next year.",
            category: "bonus",
            isRedFlag: false,
          },
          {
            id: "7",
            title: "Pre & Post Hospitalization",
            description: "30 days pre and 60 days post hospitalization",
            implication: "Medical expenses 30 days before and 60 days after hospitalization will be covered.",
            category: "hospitalization",
            isRedFlag: false,
          },
          {
            id: "8",
            title: "Restoration Benefit",
            description: "100% restoration of sum insured once per year",
            implication: "If you exhaust your coverage, it will be fully restored for future claims in the same year.",
            category: "coverage",
            isRedFlag: false,
          },
        ],
        scenarios: [
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
            baseCost: 250000,
            coverageDetails: [
              { item: "Surgery charges", amount: 150000, covered: 150000, notes: "Fully covered" },
              { item: "ICU charges (₹15,000/day × 3)", amount: 45000, covered: 45000, notes: "ICU fully covered" },
              { item: "Surgeon & anesthetist fees", amount: 35000, covered: 35000, notes: "Fully covered" },
              { item: "Medicines & consumables", amount: 20000, covered: 20000, notes: "Fully covered" },
            ],
          },
          {
            id: "scenario3",
            title: "Dialysis Treatment",
            description: "Regular dialysis sessions over 3 months",
            baseCost: 180000,
            coverageDetails: [
              { item: "Dialysis sessions (24 sessions)", amount: 144000, covered: 144000, notes: "Fully covered" },
              { item: "Medicines", amount: 20000, covered: 20000, notes: "Fully covered" },
              { item: "Doctor consultations", amount: 16000, covered: 16000, notes: "Fully covered" },
            ],
          },
        ],
      })
    }
  }, [recommendedPlan])

  if (!policyData) {
    return <div>Loading policy data...</div>
  }

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{policyData.name}</h2>
              <p className="text-gray-500">{policyData.provider}</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center gap-4">
              <div className="bg-muted p-2 rounded-md">
                <span className="text-sm font-medium">Premium: </span>
                <span className="font-bold">{policyData.premium}</span>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <span className="text-sm font-medium">Sum Insured: </span>
                <span className="font-bold">{policyData.sumInsured}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="summary">Policy Summary</TabsTrigger>
            <TabsTrigger value="scenarios">Scenario-Based Learning</TabsTrigger>
            <TabsTrigger value="risk">Visual Risk Calculator</TabsTrigger>
            <TabsTrigger value="redflags">Red Flag Highlights</TabsTrigger>
            <TabsTrigger value="clausemap">Visual Clause Map</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <PolicySummary policyData={policyData} />
          </TabsContent>

          <TabsContent value="scenarios">
            <ScenarioBasedLearning policyData={policyData} />
          </TabsContent>

          <TabsContent value="risk">
            <VisualRiskCalculator policyData={policyData} />
          </TabsContent>

          <TabsContent value="redflags">
            <RedFlagHighlights policyData={policyData} />
          </TabsContent>

          <TabsContent value="clausemap">
            <VisualClauseMap policyData={policyData} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
