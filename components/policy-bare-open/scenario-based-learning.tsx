"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { PlusCircle, MinusCircle } from "lucide-react"

type CoverageDetail = {
  item: string
  amount: number
  covered: number
  notes: string
}

type Scenario = {
  id: string
  title: string
  description: string
  baseCost: number
  coverageDetails: CoverageDetail[]
}

type ScenarioBasedLearningProps = {
  policyData: {
    scenarios: Scenario[]
    [key: string]: any
  }
}

export function ScenarioBasedLearning({ policyData }: ScenarioBasedLearningProps) {
  const [activeScenario, setActiveScenario] = useState(policyData.scenarios[0].id)
  const [customScenario, setCustomScenario] = useState<CoverageDetail[]>([
    { item: "Hospital Room (per day)", amount: 5000, covered: 5000, notes: "Fully covered up to room rent limit" },
  ])
  const [customDays, setCustomDays] = useState(1)

  const handleDragEnd = (result: DropResult) => {
    // Handle drag and drop logic here
    if (!result.destination) return

    const items = Array.from(customScenario)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCustomScenario(items)
  }

  const addCustomItem = () => {
    setCustomScenario([...customScenario, { item: "New Item", amount: 0, covered: 0, notes: "Enter details" }])
  }

  const removeCustomItem = (index: number) => {
    const newItems = [...customScenario]
    newItems.splice(index, 1)
    setCustomScenario(newItems)
  }

  const updateCustomItem = (index: number, field: keyof CoverageDetail, value: any) => {
    const newItems = [...customScenario]
    newItems[index] = { ...newItems[index], [field]: value }
    setCustomScenario(newItems)
  }

  const getCurrentScenario = () => {
    if (activeScenario === "custom") {
      return {
        id: "custom",
        title: "Custom Scenario",
        description: "Your custom medical scenario",
        baseCost:
          customScenario.reduce((sum, item) => sum + item.amount, 0) *
          (activeScenario === "custom-hospital" ? customDays : 1),
        coverageDetails: customScenario.map((item) => ({
          ...item,
          amount:
            activeScenario === "custom-hospital" && item.item === "Hospital Room (per day)"
              ? item.amount * customDays
              : item.amount,
          covered:
            activeScenario === "custom-hospital" && item.item === "Hospital Room (per day)"
              ? Math.min(item.covered * customDays, item.amount * customDays)
              : Math.min(item.covered, item.amount),
        })),
      }
    }

    return policyData.scenarios.find((s) => s.id === activeScenario) || policyData.scenarios[0]
  }

  const scenario = getCurrentScenario()
  const totalAmount = scenario.coverageDetails.reduce((sum, item) => sum + item.amount, 0)
  const totalCovered = scenario.coverageDetails.reduce((sum, item) => sum + item.covered, 0)
  const outOfPocket = totalAmount - totalCovered
  const coveragePercentage = totalAmount > 0 ? Math.round((totalCovered / totalAmount) * 100) : 0

  return (
    <div className="space-y-8">
      <Tabs defaultValue={policyData.scenarios[0].id} value={activeScenario} onValueChange={setActiveScenario}>
        <TabsList className="mb-4">
          {policyData.scenarios.map((scenario) => (
            <TabsTrigger key={scenario.id} value={scenario.id}>
              {scenario.title}
            </TabsTrigger>
          ))}
          <TabsTrigger value="custom">Custom Scenario</TabsTrigger>
        </TabsList>

        {policyData.scenarios.map((scenario) => (
          <TabsContent key={scenario.id} value={scenario.id}>
            <ScenarioDetails scenario={scenario} />
          </TabsContent>
        ))}

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Build Your Custom Scenario</CardTitle>
              <CardDescription>
                Drag and drop medical expenses to create your own scenario and see what would be covered
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeScenario === "custom" && (
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="font-medium">Hospital Stay Duration:</div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCustomDays(Math.max(1, customDays - 1))}
                        disabled={customDays <= 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="mx-3 font-bold">{customDays} days</span>
                      <Button variant="outline" size="icon" onClick={() => setCustomDays(customDays + 1)}>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="expenses">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {customScenario.map((item, index) => (
                        <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="border rounded-lg p-3 bg-white shadow-sm"
                            >
                              <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    value={item.item}
                                    onChange={(e) => updateCustomItem(index, "item", e.target.value)}
                                    className="w-full border-none bg-transparent font-medium focus:outline-none focus:ring-0"
                                  />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-2">Cost:</span>
                                    <input
                                      type="number"
                                      value={item.amount}
                                      onChange={(e) =>
                                        updateCustomItem(index, "amount", Number.parseInt(e.target.value) || 0)
                                      }
                                      className="w-24 border rounded p-1 text-right"
                                    />
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-2">Covered:</span>
                                    <input
                                      type="number"
                                      value={item.covered}
                                      onChange={(e) =>
                                        updateCustomItem(index, "covered", Number.parseInt(e.target.value) || 0)
                                      }
                                      className="w-24 border rounded p-1 text-right"
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeCustomItem(index)}
                                    className="text-red-500"
                                  >
                                    <MinusCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <input
                                type="text"
                                value={item.notes}
                                onChange={(e) => updateCustomItem(index, "notes", e.target.value)}
                                className="w-full mt-2 text-sm text-gray-500 border-none bg-transparent focus:outline-none focus:ring-0"
                                placeholder="Add notes about coverage"
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <Button variant="outline" onClick={addCustomItem} className="mt-4 w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Expense Item
              </Button>

              <div className="mt-8">
                <ScenarioDetails scenario={scenario} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ScenarioDetails({ scenario }: { scenario: Scenario }) {
  const totalAmount = scenario.coverageDetails.reduce((sum, item) => sum + item.amount, 0)
  const totalCovered = scenario.coverageDetails.reduce((sum, item) => sum + item.covered, 0)
  const outOfPocket = totalAmount - totalCovered
  const coveragePercentage = totalAmount > 0 ? Math.round((totalCovered / totalAmount) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{scenario.title}</CardTitle>
        <CardDescription>{scenario.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm text-gray-500">Total Cost</div>
              <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm text-gray-500">Covered by Insurance</div>
              <div className="text-2xl font-bold text-green-600">₹{totalCovered.toLocaleString()}</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm text-gray-500">Your Out-of-Pocket</div>
              <div className="text-2xl font-bold text-red-600">₹{outOfPocket.toLocaleString()}</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-green-600 h-4 rounded-full" style={{ width: `${coveragePercentage}%` }}></div>
          </div>
          <div className="text-center text-sm">
            <span className="font-medium">{coveragePercentage}%</span> of total cost covered by insurance
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Expense Item
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Covered
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    You Pay
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scenario.coverageDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{detail.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ₹{detail.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="text-green-600">₹{detail.covered.toLocaleString()}</span>
                      <div className="text-xs text-gray-500 mt-1">{detail.notes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                      ₹{(detail.amount - detail.covered).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <td className="px-6 py-3 text-right text-xs font-medium text-gray-900">
                    ₹{totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right text-xs font-medium text-green-600">
                    ₹{totalCovered.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right text-xs font-medium text-red-600">
                    ₹{outOfPocket.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
