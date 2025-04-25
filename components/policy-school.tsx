"use client"
import { useLanguage } from "./language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertCircle, BookOpen, FileText, Shield, Users } from "lucide-react"

export function PolicySchool() {
  const { t } = useLanguage()

  const policyTypes = [
    {
      id: "basics",
      icon: <BookOpen className="h-5 w-5" />,
      title: "Insurance Basics",
      description: "Fundamental concepts of health insurance",
      content: [
        {
          title: "What is Health Insurance?",
          content:
            "Health insurance is a type of insurance coverage that pays for medical and surgical expenses incurred by the insured. Health insurance can reimburse the insured for expenses incurred from illness or injury, or pay the care provider directly.",
        },
        {
          title: "Premium vs. Coverage",
          content:
            "Premium is the amount you pay to the insurance company for your policy, typically on a monthly or annual basis. Coverage refers to the maximum amount the insurer will pay for your medical expenses. Higher coverage usually means higher premiums.",
        },
        {
          title: "Deductibles and Co-payments",
          content:
            "A deductible is the amount you pay before your insurance starts covering costs. Co-payment (or co-pay) is a fixed amount you pay for a covered healthcare service. For example, you might pay ₹500 for a doctor visit and your insurance covers the rest.",
        },
        {
          title: "Waiting Period",
          content:
            "Most health insurance policies have waiting periods during which specific conditions are not covered. There's typically a 30-day initial waiting period for all illnesses (except accidents), and a 2-4 year waiting period for pre-existing conditions.",
        },
      ],
    },
    {
      id: "individual",
      icon: <Shield className="h-5 w-5" />,
      title: "Individual Plans",
      description: "Health insurance for individuals",
      content: [
        {
          title: "Who Should Get Individual Health Insurance?",
          content:
            "Individual health insurance is ideal for single people, young professionals, or those who want personalized coverage. It provides coverage for a single person based on their specific health needs and budget.",
        },
        {
          title: "Benefits of Individual Plans",
          content:
            "Individual plans offer personalized coverage, often with lower premiums for young, healthy individuals. They can be tailored to your specific health concerns and typically offer more flexibility in choosing coverage options.",
        },
        {
          title: "No Claim Bonus",
          content:
            "If you don't make any claims during a policy year, most insurers offer a No Claim Bonus (NCB). This increases your sum insured (typically by 5-50%) for the next year without any increase in premium, effectively giving you more coverage for the same cost.",
        },
        {
          title: "Portability",
          content:
            "Health insurance portability allows you to transfer your existing policy to a new insurer while retaining benefits like waiting period credits. This gives you the freedom to switch insurers if you're not satisfied with the service.",
        },
      ],
    },
    {
      id: "family",
      icon: <Users className="h-5 w-5" />,
      title: "Family Plans",
      description: "Health insurance for families",
      content: [
        {
          title: "What is a Family Floater Policy?",
          content:
            "A family floater policy covers your entire family under a single sum insured. The premium is based on the age of the oldest member. This is usually more cost-effective than individual policies for each family member.",
        },
        {
          title: "How Sum Insured Works in Family Floater",
          content:
            "The sum insured is shared among all family members. For example, if you have a ₹10 lakh policy, any family member can claim up to ₹10 lakhs, but the total claims by all members cannot exceed ₹10 lakhs in a policy year.",
        },
        {
          title: "Maternity Coverage",
          content:
            "Many family floater policies offer maternity benefits, covering expenses related to childbirth. However, there's typically a waiting period of 2-4 years before you can claim these benefits. The coverage includes pre and post-natal expenses, delivery charges, and newborn baby coverage.",
        },
        {
          title: "Child Coverage",
          content:
            "Family plans often include special benefits for children, such as vaccination coverage, congenital disease coverage, and education benefits in case something happens to the parents. Some policies also offer additional coverage for children's specific healthcare needs.",
        },
      ],
    },
    {
      id: "senior",
      icon: <AlertCircle className="h-5 w-5" />,
      title: "Senior Citizen Plans",
      description: "Health insurance for elderly",
      content: [
        {
          title: "Special Features for Seniors",
          content:
            "Senior citizen health insurance policies are designed for people aged 60 and above. They typically offer coverage for age-related illnesses, pre-existing conditions (after a waiting period), and often include benefits like domiciliary treatment and regular health check-ups.",
        },
        {
          title: "Pre-Existing Conditions Coverage",
          content:
            "Most senior care policies cover pre-existing conditions after a waiting period of 1-2 years. This is particularly important for seniors who often have chronic conditions that require ongoing treatment.",
        },
        {
          title: "Co-Payment Clause",
          content:
            "Many senior citizen health policies have a co-payment clause, which means you pay a percentage of the claim amount (usually 10-20%). This helps keep the premium affordable despite the higher risk associated with insuring older individuals.",
        },
        {
          title: "Day Care Procedures",
          content:
            "Senior citizen plans typically cover day care procedures that don't require 24-hour hospitalization, such as cataract surgery, dialysis, chemotherapy, etc. This is particularly relevant for seniors who may need these procedures more frequently.",
        },
      ],
    },
    {
      id: "claims",
      icon: <FileText className="h-5 w-5" />,
      title: "Claims Process",
      description: "How to file and process claims",
      content: [
        {
          title: "Cashless Claims",
          content:
            "For cashless claims, you need to get admitted to a network hospital and inform the insurance company or TPA (Third Party Administrator). The hospital will send the pre-authorization form to the insurer, who will approve the cashless treatment if everything is in order. You only pay for non-medical expenses or items not covered by your policy.",
        },
        {
          title: "Reimbursement Claims",
          content:
            "For reimbursement claims, you pay the hospital bills first and then submit the documents to the insurer for reimbursement. Required documents typically include the claim form, original bills and receipts, discharge summary, investigation reports, and doctor's prescriptions.",
        },
        {
          title: "Claim Settlement Ratio",
          content:
            "The Claim Settlement Ratio (CSR) is the percentage of claims settled by an insurer out of the total claims received in a financial year. A higher CSR indicates better chances of your claim being approved. It's an important factor to consider when choosing an insurance provider.",
        },
        {
          title: "Common Reasons for Claim Rejection",
          content:
            "Claims can be rejected for various reasons, including non-disclosure of pre-existing conditions, seeking treatment for excluded conditions, filing claims during the waiting period, or not providing complete documentation. Understanding these reasons can help you avoid claim rejections.",
        },
      ],
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <Tabs defaultValue="basics" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <TabsList className="flex flex-col h-auto bg-muted/50 p-1 md:p-2">
                {policyTypes.map((type) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className="flex items-center justify-start gap-2 py-3 px-4 text-left"
                  >
                    {type.icon}
                    <div>
                      <div className="font-medium">{type.title}</div>
                      <div className="text-xs text-muted-foreground hidden md:block">{type.description}</div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="md:w-3/4">
              {policyTypes.map((type) => (
                <TabsContent key={type.id} value={type.id} className="mt-0 md:mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {type.icon}
                        {type.title}
                      </CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {type.content.map((item, index) => (
                          <AccordionItem key={index} value={`${type.id}-item-${index}`}>
                            <AccordionTrigger>{item.title}</AccordionTrigger>
                            <AccordionContent>
                              <div className="text-gray-600 space-y-4">
                                <p>{item.content}</p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Insurance Glossary</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                term: "Sum Insured",
                definition:
                  "The maximum amount an insurance company will pay for claims made during the policy period.",
              },
              {
                term: "Premium",
                definition: "The amount paid by the policyholder to the insurer for the insurance coverage.",
              },
              {
                term: "Claim",
                definition:
                  "A formal request by the policyholder to the insurance company for coverage or compensation for a covered loss or policy event.",
              },
              {
                term: "Deductible",
                definition:
                  "The amount the policyholder must pay out-of-pocket before the insurance provider will pay any expenses.",
              },
              {
                term: "Co-payment",
                definition:
                  "A fixed amount that the policyholder pays for covered services, with the insurer covering the rest.",
              },
              {
                term: "Waiting Period",
                definition:
                  "The time period after buying a policy during which certain benefits are not available for claims.",
              },
              {
                term: "Pre-existing Condition",
                definition: "A health condition that existed before the start date of a health insurance policy.",
              },
              {
                term: "Network Hospital",
                definition:
                  "Hospitals that have tie-ups with insurance companies to provide cashless treatment to policyholders.",
              },
              {
                term: "TPA (Third Party Administrator)",
                definition:
                  "An organization that processes insurance claims and provides administrative services for health insurance policies.",
              },
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-muted/50 pb-3">
                  <CardTitle className="text-lg">{item.term}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600">{item.definition}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
