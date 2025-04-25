"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

type VisualRiskCalculatorProps = {
  policyData: any
}

export function VisualRiskCalculator({ policyData }: VisualRiskCalculatorProps) {
  const [age, setAge] = useState(35)
  const [hasPreExistingConditions, setHasPreExistingConditions] = useState(false)
  const [familySize, setFamilySize] = useState(1)
  const [hospitalStayLikelihood, setHospitalStayLikelihood] = useState(10)
  const [majorSurgeryLikelihood, setMajorSurgeryLikelihood] = useState(5)
  const [chronicConditionLikelihood, setChronicConditionLikelihood] = useState(8)

  // Calculate risk scores
  const calculateRiskScore = () => {
    // Base risk score
    let riskScore = 50

    // Age factor
    if (age < 30) riskScore += 10
    else if (age >= 60) riskScore -= 15
    else if (age >= 45) riskScore -= 5

    // Pre-existing conditions
    if (hasPreExistingConditions) riskScore -= 15

    // Family size
    if (familySize > 1) riskScore -= (familySize - 1) * 5

    // Likelihood factors
    const likelihoodImpact =
      (hospitalStayLikelihood / 100) * 20 +
      (majorSurgeryLikelihood / 100) * 30 +
      (chronicConditionLikelihood / 100) * 25

    riskScore -= likelihoodImpact

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(riskScore)))
  }

  const riskScore = calculateRiskScore()

  // Determine risk level and recommendations
  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: "Low Risk", color: "green", icon: CheckCircle }
    if (score >= 40) return { level: "Medium Risk", color: "amber", icon: AlertTriangle }
    return { level: "High Risk", color: "red", icon: AlertCircle }
  }

  const riskLevel = getRiskLevel(riskScore)

  // Generate recommendations based on risk profile
  const getRecommendations = () => {
    const recommendations = []

    if (age >= 60) {
      recommendations.push("Consider a senior-specific plan with lower co-payments")
    }

    if (hasPreExistingConditions) {
      recommendations.push("Look for policies with shorter waiting periods for pre-existing conditions")
    }

    if (familySize > 1) {
      recommendations.push("A family floater policy may be more cost-effective than individual policies")
    }

    if (hospitalStayLikelihood > 20) {
      recommendations.push("Choose a policy with no room rent limits or higher room rent limits")
    }

    if (majorSurgeryLikelihood > 10) {
      recommendations.push("Ensure your policy has adequate coverage for major surgeries without sub-limits")
    }

    if (chronicConditionLikelihood > 15) {
      recommendations.push("Select a policy that covers outpatient treatment and regular medication")
    }

    if (recommendations.length === 0) {
      recommendations.push("This policy appears to be a good match for your risk profile")
    }

    return recommendations
  }

  const recommendations = getRecommendations()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Risk Profile</CardTitle>
          <CardDescription>Adjust the parameters below to see how they affect your risk assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Age: {age}</Label>
              <span className="text-gray-500 text-sm">
                {age < 30 ? "Lower premium" : age >= 60 ? "Higher premium" : "Standard premium"}
              </span>
            </div>
            <Slider value={[age]} min={18} max={80} step={1} onValueChange={(value) => setAge(value[0])} />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="pre-existing">Pre-existing Conditions</Label>
            <Switch
              id="pre-existing"
              checked={hasPreExistingConditions}
              onCheckedChange={setHasPreExistingConditions}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Family Size: {familySize}</Label>
              <span className="text-gray-500 text-sm">
                {familySize > 1 ? "Family floater recommended" : "Individual plan suitable"}
              </span>
            </div>
            <Slider value={[familySize]} min={1} max={6} step={1} onValueChange={(value) => setFamilySize(value[0])} />
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-4">Likelihood of Medical Events (next 5 years)</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Hospital Stay: {hospitalStayLikelihood}%</Label>
                </div>
                <Slider
                  value={[hospitalStayLikelihood]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setHospitalStayLikelihood(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Major Surgery: {majorSurgeryLikelihood}%</Label>
                </div>
                <Slider
                  value={[majorSurgeryLikelihood]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setMajorSurgeryLikelihood(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Chronic Condition Treatment: {chronicConditionLikelihood}%</Label>
                </div>
                <Slider
                  value={[chronicConditionLikelihood]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setChronicConditionLikelihood(value[0])}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Policy Risk Assessment</CardTitle>
          <CardDescription>How well this policy matches your risk profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={riskLevel.color === "green" ? "#22c55e" : riskLevel.color === "amber" ? "#f59e0b" : "#ef4444"}
                  strokeWidth="10"
                  strokeDasharray={`${riskScore * 2.83} 283`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* Removed the duplicate text element here */}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{riskScore}%</div>
                  <div className="text-sm mt-1">Match Score</div>
                </div>
              </div>
            </div>

            <div
              className={`mt-6 flex items-center gap-2 text-lg font-semibold text-${riskLevel.color === "green" ? "green-600" : riskLevel.color === "amber" ? "amber-600" : "red-600"}`}
            >
              <riskLevel.icon className="h-6 w-6" />
              <span>{riskLevel.level}</span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Policy Strengths & Weaknesses for Your Profile</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Coverage Amount</span>
                  <p className="text-sm text-gray-600">The sum insured is adequate for your risk profile</p>
                </div>
              </div>

              {hasPreExistingConditions && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Pre-existing Conditions</span>
                    <p className="text-sm text-gray-600">2-year waiting period may leave you vulnerable</p>
                  </div>
                </div>
              )}

              {hospitalStayLikelihood > 20 && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Room Rent Limit</span>
                    <p className="text-sm text-gray-600">Room rent limits may result in out-of-pocket expenses</p>
                  </div>
                </div>
              )}

              {familySize > 1 && (
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Family Coverage</span>
                    <p className="text-sm text-gray-600">This policy offers good family coverage options</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
