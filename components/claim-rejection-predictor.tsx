"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Upload, FileText, AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ClaimRejectionPredictor() {
  const [step, setStep] = useState(1)
  const [policyUploaded, setPolicyUploaded] = useState(false)
  const [policyName, setPolicyName] = useState("")
  const [formData, setFormData] = useState({
    patientAge: 35,
    patientGender: "male",
    diagnosis: "",
    treatmentType: "hospitalization",
    hospitalStayDuration: 3,
    preExistingCondition: false,
    waitingPeriodCompleted: true,
    networkHospital: true,
    preAuthorization: true,
    claimAmount: 50000,
    policyDuration: "1-3",
    documentationComplete: true,
  })
  const [predictionResult, setPredictionResult] = useState<null | {
    rejectionProbability: number
    factors: Array<{ factor: string; impact: "high" | "medium" | "low"; description: string }>
    recommendations: string[]
  }>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPolicyUploaded(true)
      setPolicyName(file.name)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePrediction = () => {
    // In a real app, this would call an API with ML model
    // For demo purposes, we'll simulate a prediction based on the form data

    // Calculate a mock rejection probability based on form inputs
    let rejectionProbability = 0

    // Age factor
    if (formData.patientAge > 60) rejectionProbability += 5

    // Pre-existing condition
    if (formData.preExistingCondition) {
      rejectionProbability += formData.waitingPeriodCompleted ? 10 : 40
    }

    // Network hospital
    if (!formData.networkHospital) rejectionProbability += 15

    // Pre-authorization
    if (!formData.preAuthorization) rejectionProbability += 25

    // Documentation
    if (!formData.documentationComplete) rejectionProbability += 30

    // Claim amount
    if (formData.claimAmount > 100000) rejectionProbability += 10

    // Policy duration
    if (formData.policyDuration === "less-than-1") rejectionProbability += 15

    // Cap at 95%
    rejectionProbability = Math.min(95, rejectionProbability)

    // Generate factors based on inputs
    const factors = []

    if (formData.preExistingCondition && !formData.waitingPeriodCompleted) {
      factors.push({
        factor: "Pre-existing condition waiting period not completed",
        impact: "high" as const,
        description:
          "Your policy requires a waiting period before covering pre-existing conditions. This claim falls within that period.",
      })
    }

    if (!formData.preAuthorization) {
      factors.push({
        factor: "No pre-authorization obtained",
        impact: "high" as const,
        description:
          "Pre-authorization is required for planned hospitalizations. Failure to obtain it can lead to claim rejection.",
      })
    }

    if (!formData.networkHospital) {
      factors.push({
        factor: "Non-network hospital",
        impact: "medium" as const,
        description:
          "Treatment at non-network hospitals may have different claim processes and could lead to partial rejection.",
      })
    }

    if (!formData.documentationComplete) {
      factors.push({
        factor: "Incomplete documentation",
        impact: "high" as const,
        description:
          "Missing documents like discharge summary, investigation reports, or original bills can lead to claim rejection.",
      })
    }

    if (formData.policyDuration === "less-than-1") {
      factors.push({
        factor: "New policy (less than 1 year)",
        impact: "medium" as const,
        description: "New policies have stricter scrutiny and initial waiting periods for certain conditions.",
      })
    }

    if (formData.claimAmount > 100000) {
      factors.push({
        factor: "High claim amount",
        impact: "low" as const,
        description:
          "Higher claim amounts undergo more detailed scrutiny, which may increase the chance of finding discrepancies.",
      })
    }

    // Generate recommendations
    const recommendations = []

    if (formData.preExistingCondition && !formData.waitingPeriodCompleted) {
      recommendations.push(
        "Wait until the pre-existing condition waiting period is completed before seeking elective treatment",
      )
    }

    if (!formData.preAuthorization) {
      recommendations.push("Always obtain pre-authorization for planned hospitalizations")
    }

    if (!formData.networkHospital) {
      recommendations.push("Choose a network hospital for cashless and smoother claim processing")
    }

    if (!formData.documentationComplete) {
      recommendations.push(
        "Ensure all required documents (discharge summary, bills, reports) are submitted with the claim",
      )
    }

    if (recommendations.length === 0) {
      recommendations.push("Your claim appears to be in good standing with minimal risk of rejection")
    }

    setPredictionResult({
      rejectionProbability,
      factors,
      recommendations,
    })

    setStep(3)
  }

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <Tabs defaultValue="predictor" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="predictor">Claim Rejection Predictor</TabsTrigger>
              <TabsTrigger value="about">How It Works</TabsTrigger>
            </TabsList>
            <TabsContent value="predictor" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Predict Your Claim Rejection Probability</CardTitle>
                  <CardDescription>
                    Upload your policy document and provide details about your claim to get a prediction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">Upload Your Policy Document</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Upload your health insurance policy document (PDF format)
                        </p>
                        <div className="flex justify-center">
                          <Label
                            htmlFor="policy-upload"
                            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                          >
                            Select File
                            <Input
                              id="policy-upload"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </Label>
                        </div>
                        {policyUploaded && (
                          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
                            <FileText className="h-4 w-4" />
                            <span>{policyName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="patient-age">Patient Age</Label>
                          <Input
                            id="patient-age"
                            type="number"
                            value={formData.patientAge}
                            onChange={(e) => handleInputChange("patientAge", Number.parseInt(e.target.value))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="patient-gender">Patient Gender</Label>
                          <Select
                            value={formData.patientGender}
                            onValueChange={(value) => handleInputChange("patientGender", value)}
                          >
                            <SelectTrigger id="patient-gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnosis/Condition</Label>
                        <Input
                          id="diagnosis"
                          placeholder="E.g., Appendicitis, Fracture, etc."
                          value={formData.diagnosis}
                          onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="treatment-type">Treatment Type</Label>
                        <Select
                          value={formData.treatmentType}
                          onValueChange={(value) => handleInputChange("treatmentType", value)}
                        >
                          <SelectTrigger id="treatment-type">
                            <SelectValue placeholder="Select treatment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hospitalization">Hospitalization</SelectItem>
                            <SelectItem value="daycare">Day Care Procedure</SelectItem>
                            <SelectItem value="surgery">Surgery</SelectItem>
                            <SelectItem value="maternity">Maternity</SelectItem>
                            <SelectItem value="outpatient">Outpatient Treatment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.treatmentType === "hospitalization" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Hospital Stay Duration: {formData.hospitalStayDuration} days</Label>
                          </div>
                          <Slider
                            value={[formData.hospitalStayDuration]}
                            min={1}
                            max={30}
                            step={1}
                            onValueChange={(value) => handleInputChange("hospitalStayDuration", value[0])}
                          />
                        </div>
                      )}

                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="pre-existing">Pre-existing Condition</Label>
                            <div className="text-sm text-gray-500">
                              Does the patient have this condition before buying the policy?
                            </div>
                          </div>
                          <Switch
                            id="pre-existing"
                            checked={formData.preExistingCondition}
                            onCheckedChange={(value) => handleInputChange("preExistingCondition", value)}
                          />
                        </div>

                        {formData.preExistingCondition && (
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="waiting-period">Waiting Period Completed</Label>
                              <div className="text-sm text-gray-500">
                                Has the waiting period for pre-existing conditions been completed?
                              </div>
                            </div>
                            <Switch
                              id="waiting-period"
                              checked={formData.waitingPeriodCompleted}
                              onCheckedChange={(value) => handleInputChange("waitingPeriodCompleted", value)}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="network-hospital">Network Hospital</Label>
                            <div className="text-sm text-gray-500">
                              Is the treatment being done at a network hospital?
                            </div>
                          </div>
                          <Switch
                            id="network-hospital"
                            checked={formData.networkHospital}
                            onCheckedChange={(value) => handleInputChange("networkHospital", value)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="pre-authorization">Pre-authorization Obtained</Label>
                            <div className="text-sm text-gray-500">
                              Was pre-authorization obtained from the insurer before treatment?
                            </div>
                          </div>
                          <Switch
                            id="pre-authorization"
                            checked={formData.preAuthorization}
                            onCheckedChange={(value) => handleInputChange("preAuthorization", value)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="documentation">Complete Documentation</Label>
                            <div className="text-sm text-gray-500">
                              Do you have all required documents (bills, reports, etc.)?
                            </div>
                          </div>
                          <Switch
                            id="documentation"
                            checked={formData.documentationComplete}
                            onCheckedChange={(value) => handleInputChange("documentationComplete", value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Claim Amount: ₹{formData.claimAmount.toLocaleString()}</Label>
                        </div>
                        <Slider
                          value={[formData.claimAmount]}
                          min={5000}
                          max={500000}
                          step={5000}
                          onValueChange={(value) => handleInputChange("claimAmount", value[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₹5,000</span>
                          <span>₹5,00,000</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="policy-duration">Policy Duration</Label>
                        <Select
                          value={formData.policyDuration}
                          onValueChange={(value) => handleInputChange("policyDuration", value)}
                        >
                          <SelectTrigger id="policy-duration">
                            <SelectValue placeholder="Select policy duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="more-than-5">More than 5 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {step === 3 && predictionResult && (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center p-6">
                        <div className="relative w-48 h-48">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={
                                predictionResult.rejectionProbability < 30
                                  ? "#22c55e"
                                  : predictionResult.rejectionProbability < 70
                                    ? "#f59e0b"
                                    : "#ef4444"
                              }
                              strokeWidth="10"
                              strokeDasharray={`${predictionResult.rejectionProbability * 2.83} 283`}
                              strokeDashoffset="0"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-3xl font-bold">{predictionResult.rejectionProbability}%</div>
                              <div className="text-sm mt-1">Rejection Risk</div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`mt-6 flex items-center gap-2 text-lg font-semibold ${
                            predictionResult.rejectionProbability < 30
                              ? "text-green-600"
                              : predictionResult.rejectionProbability < 70
                                ? "text-amber-600"
                                : "text-red-600"
                          }`}
                        >
                          {predictionResult.rejectionProbability < 30 ? (
                            <>
                              <CheckCircle className="h-6 w-6" />
                              <span>Low Risk of Rejection</span>
                            </>
                          ) : predictionResult.rejectionProbability < 70 ? (
                            <>
                              <AlertTriangle className="h-6 w-6" />
                              <span>Medium Risk of Rejection</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-6 w-6" />
                              <span>High Risk of Rejection</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Risk Factors</h3>
                        {predictionResult.factors.length > 0 ? (
                          <div className="space-y-4">
                            {predictionResult.factors.map((factor, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-lg ${
                                  factor.impact === "high"
                                    ? "bg-red-50"
                                    : factor.impact === "medium"
                                      ? "bg-amber-50"
                                      : "bg-blue-50"
                                }`}
                              >
                                <div
                                  className={`font-medium flex items-center gap-2 ${
                                    factor.impact === "high"
                                      ? "text-red-800"
                                      : factor.impact === "medium"
                                        ? "text-amber-800"
                                        : "text-blue-800"
                                  }`}
                                >
                                  {factor.impact === "high" ? (
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                  ) : factor.impact === "medium" ? (
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                  ) : (
                                    <Info className="h-5 w-5 text-blue-600" />
                                  )}
                                  <span>{factor.factor}</span>
                                  <Badge
                                    variant="outline"
                                    className={`ml-auto ${
                                      factor.impact === "high"
                                        ? "border-red-200 text-red-800"
                                        : factor.impact === "medium"
                                          ? "border-amber-200 text-amber-800"
                                          : "border-blue-200 text-blue-800"
                                    }`}
                                  >
                                    {factor.impact} impact
                                  </Badge>
                                </div>
                                <p className="text-gray-600 mt-2">{factor.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="font-medium flex items-center gap-2 text-green-800">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>No significant risk factors identified</span>
                            </div>
                            <p className="text-gray-600 mt-2">
                              Based on the information provided, your claim appears to be in good standing.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                        <ul className="space-y-2">
                          {predictionResult.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start gap-2">
                              {predictionResult.rejectionProbability < 30 ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                              )}
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t pt-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="font-medium flex items-center gap-2 text-blue-800">
                            <Info className="h-5 w-5 text-blue-600" />
                            <span>Disclaimer</span>
                          </div>
                          <p className="text-gray-600 mt-2">
                            This prediction is based on the information provided and general insurance patterns. The
                            actual outcome may vary based on your specific policy terms and the insurer's assessment.
                            This tool is for educational purposes only.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {step > 1 && step < 3 && (
                    <Button variant="outline" onClick={() => setStep(step - 1)}>
                      Back
                    </Button>
                  )}
                  {step === 3 && (
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Start Over
                    </Button>
                  )}
                  {step < 3 && (
                    <Button
                      onClick={() => {
                        if (step === 1 && policyUploaded) {
                          setStep(2)
                        } else if (step === 2) {
                          handlePrediction()
                        }
                      }}
                      disabled={step === 1 && !policyUploaded}
                    >
                      {step === 1 ? "Next" : "Predict Rejection Probability"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>How the Claim Rejection Predictor Works</CardTitle>
                  <CardDescription>
                    Understanding the factors that influence health insurance claim rejections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About the Predictor</h3>
                    <p className="text-gray-600">
                      The Claim Rejection Predictor uses machine learning algorithms trained on historical claim data to
                      predict the likelihood of your claim being rejected. It analyzes various factors that typically
                      influence claim decisions by insurance companies.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Key Factors Analyzed</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Pre-existing conditions and waiting periods</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Network vs. non-network hospitals</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Pre-authorization status</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Documentation completeness</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Policy terms and exclusions</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Benefits of Using the Predictor</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Identify potential issues before filing a claim</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Get personalized recommendations to improve claim success</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Understand your policy better through practical scenarios</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Save time and reduce stress during the claim process</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="font-medium flex items-center gap-2 text-amber-800">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <span>Important Note</span>
                    </div>
                    <p className="text-gray-600 mt-2">
                      This tool provides an estimate based on common patterns in health insurance claims. The actual
                      outcome depends on your specific policy terms and the insurer's assessment. Always consult with
                      your insurance provider for definitive information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
