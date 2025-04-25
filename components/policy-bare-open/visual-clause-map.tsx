"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

type VisualClauseMapProps = {
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

export function VisualClauseMap({ policyData }: VisualClauseMapProps) {
  const [selectedClause, setSelectedClause] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"category" | "impact">("category")

  // Group clauses by category
  const categories = Array.from(new Set(policyData.clauses.map((clause) => clause.category)))

  // Get clause by ID
  const getClauseById = (id: string) => {
    return policyData.clauses.find((clause) => clause.id === id)
  }

  // Category display names and colors
  const categoryInfo: Record<string, { name: string; color: string }> = {
    hospitalization: { name: "Hospitalization", color: "blue" },
    coverage: { name: "Coverage", color: "purple" },
    payment: { name: "Payment", color: "amber" },
    treatment: { name: "Treatment", color: "green" },
    transportation: { name: "Transportation", color: "indigo" },
    bonus: { name: "Bonuses", color: "emerald" },
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Visual Policy Map</h2>
          <p className="text-gray-500">Visualize how different policy clauses relate to each other</p>
        </div>

        <Tabs
          defaultValue="category"
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "category" | "impact")}
        >
          <TabsList>
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="impact">By Impact</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden">
                {viewMode === "category" ? (
                  <div className="absolute inset-0 flex flex-wrap content-start p-4 gap-4">
                    {categories.map((category) => {
                      const categoryClauses = policyData.clauses.filter((clause) => clause.category === category)
                      const { name, color } = categoryInfo[category] || { name: category, color: "gray" }

                      return (
                        <div key={category} className="w-full">
                          <h3 className={`text-${color}-700 font-medium mb-2`}>{name}</h3>
                          <div className="flex flex-wrap gap-2">
                            {categoryClauses.map((clause) => (
                              <Button
                                key={clause.id}
                                variant={selectedClause === clause.id ? "default" : "outline"}
                                className={`
                                  ${selectedClause === clause.id ? `bg-${color}-600 hover:bg-${color}-700` : `border-${color}-200 hover:bg-${color}-50`}
                                  ${clause.isRedFlag ? "border-red-300" : ""}
                                `}
                                onClick={() => setSelectedClause(clause.id)}
                              >
                                {clause.isRedFlag && <AlertCircle className="h-3 w-3 mr-1 text-red-500" />}
                                {clause.title}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col p-4">
                    <div className="mb-6">
                      <h3 className="text-red-700 font-medium mb-2">High Impact (Potential Issues)</h3>
                      <div className="flex flex-wrap gap-2">
                        {policyData.clauses
                          .filter((clause) => clause.isRedFlag)
                          .map((clause) => (
                            <Button
                              key={clause.id}
                              variant={selectedClause === clause.id ? "default" : "outline"}
                              className={
                                selectedClause === clause.id
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "border-red-200 hover:bg-red-50"
                              }
                              onClick={() => setSelectedClause(clause.id)}
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {clause.title}
                            </Button>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-green-700 font-medium mb-2">Standard Clauses</h3>
                      <div className="flex flex-wrap gap-2">
                        {policyData.clauses
                          .filter((clause) => !clause.isRedFlag)
                          .map((clause) => (
                            <Button
                              key={clause.id}
                              variant={selectedClause === clause.id ? "default" : "outline"}
                              className={
                                selectedClause === clause.id
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "border-green-200 hover:bg-green-50"
                              }
                              onClick={() => setSelectedClause(clause.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {clause.title}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Clause Details</CardTitle>
              <CardDescription>
                {selectedClause
                  ? "View detailed information about the selected clause"
                  : "Select a clause from the map to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedClause ? (
                <div className="space-y-4">
                  {(() => {
                    const clause = getClauseById(selectedClause)
                    if (!clause) return null

                    const { name, color } = categoryInfo[clause.category] || { name: clause.category, color: "gray" }

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{clause.title}</h3>
                          <div className={`px-2 py-1 rounded text-xs font-medium bg-${color}-100 text-${color}-800`}>
                            {name}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-500">Policy states:</div>
                          <div className="mt-1">{clause.description}</div>
                        </div>

                        <div className="p-3 rounded-md bg-amber-50">
                          <div className="text-sm font-medium text-gray-500">What this means:</div>
                          <div className="mt-1">{clause.implication}</div>
                        </div>

                        {clause.isRedFlag && (
                          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-md">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium">Potential Issue</div>
                              <p className="text-sm text-gray-600">
                                This clause may result in unexpected out-of-pocket expenses or coverage limitations.
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">Related Clauses</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {policyData.clauses
                                .filter((c) => c.category === clause.category && c.id !== clause.id)
                                .slice(0, 3)
                                .map((relatedClause) => (
                                  <Button
                                    key={relatedClause.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedClause(relatedClause.id)}
                                  >
                                    {relatedClause.title}
                                  </Button>
                                ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-500">
                  <Info className="h-12 w-12 mb-4 opacity-20" />
                  <p>Select a clause from the map to view its details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Understanding the Policy Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              The Policy Map visualizes all clauses in your health insurance policy, organized by category or impact
              level. This helps you understand how different parts of the policy relate to each other and identify
              potential areas of concern.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium">Red Flag Clauses</h4>
                  <p className="text-gray-600 mt-1">
                    Clauses that may result in unexpected out-of-pocket expenses or coverage limitations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Standard Clauses</h4>
                  <p className="text-gray-600 mt-1">
                    Common policy clauses that typically don't cause issues for most policyholders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
