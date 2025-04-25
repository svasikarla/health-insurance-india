"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Check } from "lucide-react"
import Link from "next/link"

type InsurancePolicy = {
  id: string
  name: string
  provider: string
  premium: string
  coverage: string
  rating: number
  bestFor: string
  keyFeatures: string[]
  tags: string[]
}

export function TopInsurancePolicies() {
  const [filter, setFilter] = useState<string | null>(null)

  const policies: InsurancePolicy[] = [
    {
      id: "health-shield-platinum",
      name: "Health Shield Platinum",
      provider: "ABC Insurance",
      premium: "₹15,000/year",
      coverage: "₹25 Lakhs",
      rating: 4.8,
      bestFor: "Comprehensive Coverage",
      keyFeatures: [
        "No room rent capping",
        "100% pre & post hospitalization coverage",
        "No co-payment clause",
        "Covers 30+ critical illnesses",
      ],
      tags: ["premium", "comprehensive", "family"],
    },
    {
      id: "family-care-plus",
      name: "Family Care Plus",
      provider: "XYZ Health Insurance",
      premium: "₹18,000/year",
      coverage: "₹20 Lakhs",
      rating: 4.7,
      bestFor: "Families",
      keyFeatures: [
        "Maternity coverage from day one",
        "Child vaccination coverage",
        "OPD coverage up to ₹15,000",
        "Annual health check-up for all members",
      ],
      tags: ["family", "maternity", "children"],
    },
    {
      id: "senior-secure",
      name: "Senior Secure",
      provider: "PQR General Insurance",
      premium: "₹20,000/year",
      coverage: "₹15 Lakhs",
      rating: 4.6,
      bestFor: "Senior Citizens",
      keyFeatures: [
        "No medical check-up up to age 70",
        "Domiciliary treatment covered",
        "Covers pre-existing diseases after 1 year",
        "10% co-payment only",
      ],
      tags: ["senior", "pre-existing", "domiciliary"],
    },
    {
      id: "young-shield",
      name: "Young Shield",
      provider: "LMN Insurance",
      premium: "₹8,000/year",
      coverage: "₹10 Lakhs",
      rating: 4.5,
      bestFor: "Young Professionals",
      keyFeatures: [
        "Adventure sports coverage",
        "Mental health coverage",
        "Fitness and wellness benefits",
        "Digital health consultations",
      ],
      tags: ["young", "affordable", "digital"],
    },
    {
      id: "critical-care-max",
      name: "Critical Care Max",
      provider: "DEF Health",
      premium: "₹12,000/year",
      coverage: "₹50 Lakhs",
      rating: 4.9,
      bestFor: "Critical Illness Coverage",
      keyFeatures: [
        "Covers 50+ critical illnesses",
        "Lump sum payout on diagnosis",
        "No hospitalization required for claim",
        "International treatment coverage",
      ],
      tags: ["critical illness", "international", "specialized"],
    },
    {
      id: "value-health",
      name: "Value Health",
      provider: "GHI Insurance",
      premium: "₹6,000/year",
      coverage: "₹5 Lakhs",
      rating: 4.3,
      bestFor: "Budget Option",
      keyFeatures: [
        "Essential hospitalization coverage",
        "No claim bonus up to 50%",
        "Cashless treatment at 3000+ hospitals",
        "Tax benefits under Section 80D",
      ],
      tags: ["affordable", "basic", "value"],
    },
    {
      id: "complete-health",
      name: "Complete Health",
      provider: "JKL Insurance",
      premium: "₹14,000/year",
      coverage: "₹15 Lakhs",
      rating: 4.6,
      bestFor: "All-round Protection",
      keyFeatures: [
        "Covers allopathy, ayurveda, homeopathy",
        "Daily hospital cash benefit",
        "Restoration of sum insured",
        "Organ donor expenses covered",
      ],
      tags: ["alternative medicine", "comprehensive", "restoration"],
    },
    {
      id: "corporate-plus",
      name: "Corporate Plus",
      provider: "MNO Health Insurance",
      premium: "₹10,000/year per employee",
      coverage: "₹10 Lakhs",
      rating: 4.5,
      bestFor: "Corporate Groups",
      keyFeatures: [
        "Covers employees and dependents",
        "Maternity benefits after 9 months",
        "Pre-existing diseases covered from day one",
        "Wellness programs included",
      ],
      tags: ["corporate", "group", "wellness"],
    },
    {
      id: "diabetes-care",
      name: "Diabetes Care",
      provider: "RST Insurance",
      premium: "₹16,000/year",
      coverage: "₹10 Lakhs",
      rating: 4.7,
      bestFor: "Diabetic Patients",
      keyFeatures: [
        "Covers pre-existing diabetes from day one",
        "Regular check-ups and consultations",
        "Covers diabetes-related complications",
        "Wellness and diet counseling",
      ],
      tags: ["diabetes", "specialized", "pre-existing"],
    },
    {
      id: "covid-shield",
      name: "Covid Shield",
      provider: "UVW Insurance",
      premium: "₹3,000/year",
      coverage: "₹5 Lakhs",
      rating: 4.4,
      bestFor: "Covid-19 Protection",
      keyFeatures: [
        "Covers Covid-19 hospitalization",
        "Home care treatment covered",
        "Vaccination side effects covered",
        "Teleconsultation benefits",
      ],
      tags: ["covid", "specialized", "affordable"],
    },
  ]

  const filteredPolicies = filter ? policies.filter((policy) => policy.tags.includes(filter)) : policies

  const tags = Array.from(new Set(policies.flatMap((policy) => policy.tags)))

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Top 10 Health Insurance Policies
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Compare the best health insurance plans in India based on coverage, premium, and benefits
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button
            variant={filter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
            className="rounded-full"
          >
            All
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={filter === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tag)}
              className="rounded-full"
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPolicies.map((policy) => (
            <Card key={policy.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{policy.name}</CardTitle>
                    <CardDescription>{policy.provider}</CardDescription>
                  </div>
                  <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">
                    <Star className="h-4 w-4 mr-1 fill-amber-500 text-amber-500" />
                    {policy.rating}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Premium</div>
                    <div className="font-bold">{policy.premium}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Coverage</div>
                    <div className="font-bold">{policy.coverage}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Best For</div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    <span>{policy.bestFor}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Key Features</div>
                  <ul className="space-y-1">
                    {policy.keyFeatures.slice(0, 2).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex flex-wrap gap-1">
                  {policy.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/policy-details/${policy.id}`}>
                  <Button size="sm">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
