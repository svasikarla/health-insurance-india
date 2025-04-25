"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Check, X, AlertCircle, MapPin, Phone, Clock, Calendar } from "lucide-react"

type PolicyDetailsProps = {
  policyId: string
}

export function PolicyDetails({ policyId }: PolicyDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [policyData, setPolicyData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll simulate loading the data
    setLoading(true)
    setTimeout(() => {
      // Mock data for the policy
      const mockPolicyData = {
        id: policyId,
        name: getPolicyName(policyId),
        provider: getProviderName(policyId),
        premium: "₹15,000/year",
        coverage: "₹25 Lakhs",
        rating: 4.8,
        description:
          "A comprehensive health insurance plan designed to provide complete protection for you and your family with extensive coverage and minimal exclusions.",
        coverageDetails: {
          roomRent: "No capping",
          preExisting: "After 2 years",
          maternity: "Covered after 3 years",
          daycare: "All procedures covered",
          prePostHospitalization: "60 days pre, 90 days post",
          ambulance: "₹3,000 per hospitalization",
          organDonor: "Covered",
          ayush: "Covered up to ₹50,000",
          healthCheckup: "Annual for all members",
          restoration: "100% once per year",
          noClaimBonus: "10% per year, max 50%",
          coPayment: "None",
        },
        exclusions: [
          "Cosmetic treatments unless necessitated by injury",
          "Self-inflicted injuries",
          "Treatment for alcohol or drug rehabilitation",
          "Expenses arising from war or act of war",
          "Dental treatment unless necessitated by accident",
          "Experimental or unproven treatments",
        ],
        networkHospitals: [
          {
            name: "Apollo Hospital",
            address: "Plot No. 1, Banjara Hills, Hyderabad",
            phone: "+91 40 2360 7777",
            distance: "2.5 km",
          },
          {
            name: "Fortis Hospital",
            address: "154/9, Bannerghatta Road, Bangalore",
            phone: "+91 80 6621 4444",
            distance: "5.2 km",
          },
          {
            name: "Max Super Speciality Hospital",
            address: "1, Press Enclave Road, Saket, New Delhi",
            phone: "+91 11 2651 5050",
            distance: "3.8 km",
          },
          {
            name: "Kokilaben Dhirubhai Ambani Hospital",
            address: "Rao Saheb, Achutrao Patwardhan Marg, Mumbai",
            phone: "+91 22 3066 6666",
            distance: "7.1 km",
          },
          {
            name: "Medanta - The Medicity",
            address: "CH Baktawar Singh Road, Sector 38, Gurugram",
            phone: "+91 124 441 4141",
            distance: "10.3 km",
          },
        ],
        claimProcess: [
          {
            step: 1,
            title: "Intimation",
            description: "Inform the insurance company about hospitalization within 24 hours",
            doThis: "Call the toll-free number or use the mobile app to register your claim",
            dontDoThis: "Don't delay intimation beyond 24 hours for planned hospitalization",
          },
          {
            step: 2,
            title: "Pre-authorization",
            description: "For cashless treatment, get pre-authorization from the insurer",
            doThis: "Submit the pre-authorization form through the hospital's insurance desk",
            dontDoThis: "Don't proceed with treatment without confirmation of pre-authorization",
          },
          {
            step: 3,
            title: "Document Submission",
            description: "Submit all required documents for claim processing",
            doThis: "Keep all original bills, reports, and prescriptions safely",
            dontDoThis: "Don't submit photocopies instead of original documents",
          },
          {
            step: 4,
            title: "Claim Processing",
            description: "The insurer verifies and processes your claim",
            doThis: "Follow up regularly on the status of your claim",
            dontDoThis: "Don't provide incorrect or incomplete information",
          },
          {
            step: 5,
            title: "Settlement",
            description: "Claim is settled directly with hospital or reimbursed to you",
            doThis: "Check the final settlement amount and details",
            dontDoThis: "Don't forget to collect the discharge summary and final bills",
          },
        ],
        coverageHeatmap: {
          hospitalization: "full", // full, partial, none
          preExisting: "partial",
          maternity: "partial",
          daycare: "full",
          outpatient: "none",
          dentalCare: "none",
          mentalHealth: "partial",
          alternativeMedicine: "partial",
          organTransplant: "full",
          criticalIllness: "full",
          accidentalInjury: "full",
          ambulance: "full",
          domiciliary: "partial",
          healthCheckup: "full",
          internationalCoverage: "none",
        },
      }

      setPolicyData(mockPolicyData)
      setLoading(false)
    }, 1000)
  }, [policyId])

  // Helper functions to get policy name and provider based on ID
  function getPolicyName(id: string): string {
    const policyNames: Record<string, string> = {
      "health-shield-platinum": "Health Shield Platinum",
      "family-care-plus": "Family Care Plus",
      "senior-secure": "Senior Secure",
      "young-shield": "Young Shield",
      "critical-care-max": "Critical Care Max",
      "value-health": "Value Health",
      "complete-health": "Complete Health",
      "corporate-plus": "Corporate Plus",
      "diabetes-care": "Diabetes Care",
      "covid-shield": "Covid Shield",
    }
    return policyNames[id] || "Health Insurance Policy"
  }

  function getProviderName(id: string): string {
    const providerNames: Record<string, string> = {
      "health-shield-platinum": "ABC Insurance",
      "family-care-plus": "XYZ Health Insurance",
      "senior-secure": "PQR General Insurance",
      "young-shield": "LMN Insurance",
      "critical-care-max": "DEF Health",
      "value-health": "GHI Insurance",
      "complete-health": "JKL Insurance",
      "corporate-plus": "MNO Health Insurance",
      "diabetes-care": "RST Insurance",
      "covid-shield": "UVW Insurance",
    }
    return providerNames[id] || "Insurance Provider"
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!policyData) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Policy not found</h2>
          <p className="text-gray-500 mt-2">The policy you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{policyData.name}</h2>
                <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">
                  <Star className="h-4 w-4 mr-1 fill-amber-500 text-amber-500" />
                  {policyData.rating}
                </div>
              </div>
              <p className="text-gray-500">{policyData.provider}</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center gap-4">
              <div className="bg-muted p-2 rounded-md">
                <span className="text-sm font-medium">Premium: </span>
                <span className="font-bold">{policyData.premium}</span>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <span className="text-sm font-medium">Coverage: </span>
                <span className="font-bold">{policyData.coverage}</span>
              </div>
              <Button>Apply Now</Button>
            </div>
          </div>
          <p className="mt-4 text-gray-600">{policyData.description}</p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="coverage-heatmap">Coverage Heatmap</TabsTrigger>
            <TabsTrigger value="claim-journey">Claim Journey</TabsTrigger>
            <TabsTrigger value="network-hospitals">Network Hospitals</TabsTrigger>
            <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Policy Overview</CardTitle>
                <CardDescription>Key features and benefits of {policyData.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Coverage Details</h3>
                    <div className="space-y-3">
                      {Object.entries(policyData.coverageDetails).map(([key, value]) => {
                        // Convert camelCase to Title Case with spaces
                        const formattedKey = key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                          .replace(/([A-Z])\w+/g, (str) => {
                            if (str === "Pre" || str === "Post") return str
                            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
                          })

                        return (
                          <div key={key} className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-600">{formattedKey}</span>
                            <span className="font-medium">{value as string}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Policy Benefits</h3>
                    <div className="grid gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium flex items-center gap-2 text-green-800">
                          <Shield className="h-5 w-5 text-green-600" />
                          Comprehensive Coverage
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Covers hospitalization, pre & post hospitalization, day care procedures, and more.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium flex items-center gap-2 text-blue-800">
                          <Clock className="h-5 w-5 text-blue-600" />
                          Waiting Period
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          30 days for general illnesses, 2 years for pre-existing conditions, 3 years for maternity.
                        </p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium flex items-center gap-2 text-purple-800">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          Lifetime Renewability
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Policy can be renewed throughout your lifetime with continued benefits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coverage-heatmap">
            <Card>
              <CardHeader>
                <CardTitle>Coverage Heatmap</CardTitle>
                <CardDescription>Visual representation of what's covered in your policy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(policyData.coverageHeatmap).map(([key, value]) => {
                    // Convert camelCase to Title Case with spaces
                    const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())

                    let bgColor = "bg-gray-100"
                    let textColor = "text-gray-800"
                    let icon = <X className="h-5 w-5 text-red-500" />

                    if (value === "full") {
                      bgColor = "bg-green-100"
                      textColor = "text-green-800"
                      icon = <Check className="h-5 w-5 text-green-500" />
                    } else if (value === "partial") {
                      bgColor = "bg-amber-100"
                      textColor = "text-amber-800"
                      icon = <AlertCircle className="h-5 w-5 text-amber-500" />
                    }

                    return (
                      <div key={key} className={`p-4 rounded-lg ${bgColor} ${textColor}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{formattedKey}</span>
                          {icon}
                        </div>
                        <div className="text-sm mt-1">
                          {value === "full" && "Fully covered"}
                          {value === "partial" && "Partially covered"}
                          {value === "none" && "Not covered"}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded"></div>
                    <span className="text-sm">Fully Covered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-100 rounded"></div>
                    <span className="text-sm">Partially Covered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded"></div>
                    <span className="text-sm">Not Covered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claim-journey">
            <Card>
              <CardHeader>
                <CardTitle>Claim Journey Flowchart</CardTitle>
                <CardDescription>Step-by-step guide to making a successful claim</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Connecting line */}
                  <div className="absolute left-[42px] top-10 bottom-10 w-1 bg-gray-200 z-0"></div>

                  <div className="space-y-8 relative z-10">
                    {policyData.claimProcess.map((step: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                          <div className="text-primary font-bold text-xl">{step.step}</div>
                        </div>
                        <div className="flex-grow pt-2">
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                          <p className="text-gray-600 mb-3">{step.description}</p>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="p-3 bg-green-50 rounded-lg">
                              <div className="font-medium flex items-center gap-2 text-green-800">
                                <Check className="h-5 w-5 text-green-600" />
                                Do This
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{step.doThis}</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                              <div className="font-medium flex items-center gap-2 text-red-800">
                                <X className="h-5 w-5 text-red-600" />
                                Don't Do This
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{step.dontDoThis}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network-hospitals">
            <Card>
              <CardHeader>
                <CardTitle>Network Hospital Finder</CardTitle>
                <CardDescription>Hospitals where you can avail cashless treatment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive map will be displayed here</p>
                    <p className="text-sm text-gray-400">
                      (In a real application, this would be an interactive Google Maps integration)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Nearby Network Hospitals</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {policyData.networkHospitals.map((hospital: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium">{hospital.name}</h4>
                        <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>{hospital.address}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>{hospital.phone}</span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {hospital.distance} away
                          </Badge>
                          <Button size="sm" variant="outline">
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exclusions">
            <Card>
              <CardHeader>
                <CardTitle>Policy Exclusions</CardTitle>
                <CardDescription>Conditions and treatments not covered under this policy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {policyData.exclusions.map((exclusion: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-800">{exclusion}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-amber-800">Important Note</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        This is not an exhaustive list of exclusions. Please refer to the policy document for complete
                        details on exclusions, waiting periods, and other terms and conditions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
