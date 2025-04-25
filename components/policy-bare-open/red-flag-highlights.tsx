"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type RedFlagHighlightsProps = {
  policyData: {
    clauses: Array<{
      id: string
      title: string
      description: string
      implication: string
      category: string
      isRedFlag: boolean
    }>
    [key: string]: any
  }
}

export function RedFlagHighlights({ policyData }: RedFlagHighlightsProps) {
  const redFlags = policyData.clauses.filter((clause) => clause.isRedFlag)

  // Group red flags by category
  const groupedRedFlags: Record<string, typeof redFlags> = {}
  redFlags.forEach((flag) => {
    if (!groupedRedFlags[flag.category]) {
      groupedRedFlags[flag.category] = []
    }
    groupedRedFlags[flag.category].push(flag)
  })

  // Category display names and icons
  const categoryInfo: Record<string, { name: string; icon: any }> = {
    hospitalization: { name: "Hospitalization", icon: AlertCircle },
    coverage: { name: "Coverage Limits", icon: AlertTriangle },
    payment: { name: "Payment Terms", icon: AlertCircle },
    treatment: { name: "Treatment Restrictions", icon: AlertTriangle },
    transportation: { name: "Transportation", icon: Info },
    bonus: { name: "Bonuses & Benefits", icon: Info },
  }

  return (
    <div className="space-y-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Red Flag Alert</h3>
            <p className="text-red-700 mt-1">
              We've identified {redFlags.length} potential issues in this policy that could lead to unexpected
              out-of-pocket expenses or coverage gaps.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(groupedRedFlags).map(([category, flags]) => {
          const { name, icon: Icon } = categoryInfo[category] || {
            name: category.charAt(0).toUpperCase() + category.slice(1),
            icon: AlertTriangle,
          }

          return (
            <Card key={category} className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-red-500" />
                  {name} Issues
                </CardTitle>
                <CardDescription>
                  {flags.length} potential {flags.length === 1 ? "problem" : "problems"} identified
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  {flags.map((flag, index) => (
                    <AccordionItem key={flag.id} value={flag.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span>{flag.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pl-6">
                          <div>
                            <div className="font-medium">Policy states:</div>
                            <div className="text-gray-600">{flag.description}</div>
                          </div>
                          <div>
                            <div className="font-medium">What this means:</div>
                            <div className="text-red-600">{flag.implication}</div>
                          </div>
                          <div className="bg-amber-50 p-3 rounded-md">
                            <div className="font-medium flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              <span>What to watch out for:</span>
                            </div>
                            <div className="text-gray-700 mt-1">
                              {flag.category === "hospitalization" &&
                                "Choose hospitals with room rates within the limit or be prepared to pay the difference."}
                              {flag.category === "coverage" &&
                                "Be aware of these coverage gaps when planning your healthcare."}
                              {flag.category === "payment" && "Budget for these additional out-of-pocket expenses."}
                              {flag.category === "treatment" &&
                                "Check if your expected treatments fall under these restrictions."}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Address These Red Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">Ask for Clarification</h4>
                <p className="text-gray-600 mt-1">
                  Contact the insurance provider to get detailed explanations about these clauses and how they might
                  affect you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">Compare Alternatives</h4>
                <p className="text-gray-600 mt-1">
                  Check if other policies offer better terms for these specific clauses that are important to you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">Consider Add-ons</h4>
                <p className="text-gray-600 mt-1">
                  Some insurers offer add-on covers that can address these limitations for an additional premium.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">Plan for Gaps</h4>
                <p className="text-gray-600 mt-1">
                  If you decide to proceed with this policy, create a financial plan to cover potential out-of-pocket
                  expenses.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
