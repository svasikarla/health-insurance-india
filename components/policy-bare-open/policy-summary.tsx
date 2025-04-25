"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion"

type PolicyClause = {
  id: string
  title: string
  description: string
  implication: string
  category: string
  isRedFlag: boolean
}

type PolicySummaryProps = {
  policyData: {
    clauses: PolicyClause[]
    [key: string]: any
  }
}

export function PolicySummary({ policyData }: PolicySummaryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [bookmarkedClauses, setBookmarkedClauses] = useState<string[]>([])
  const [direction, setDirection] = useState<"left" | "right" | null>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const cardOpacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])
  const leftIconOpacity = useTransform(x, [-200, -50, 0], [1, 0.5, 0])
  const rightIconOpacity = useTransform(x, [0, 50, 200], [0, 0.5, 1])

  const dragEndHandler = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handleSwipe("right")
    } else if (info.offset.x < -100) {
      handleSwipe("left")
    } else {
      x.set(0)
    }
  }

  const handleSwipe = (dir: "left" | "right") => {
    setDirection(dir)

    if (dir === "right") {
      // Bookmark the clause
      setBookmarkedClauses((prev) => [...prev, policyData.clauses[currentIndex].id])
    }

    // Move to the next card after a short delay
    setTimeout(() => {
      if (currentIndex < policyData.clauses.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
      x.set(0)
      setDirection(null)
    }, 300)
  }

  const resetCards = () => {
    setCurrentIndex(0)
    setBookmarkedClauses([])
  }

  const currentClause = policyData.clauses[currentIndex]
  const isFinished = currentIndex >= policyData.clauses.length

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md mx-auto relative min-h-[400px] mb-8">
        {!isFinished ? (
          <>
            <div className="absolute top-0 left-0 right-0 flex justify-between p-4 z-10">
              <motion.div style={{ opacity: leftIconOpacity }} className="bg-white rounded-full p-2 shadow-md">
                <X className="h-6 w-6 text-red-500" />
              </motion.div>
              <motion.div style={{ opacity: rightIconOpacity }} className="bg-white rounded-full p-2 shadow-md">
                <Bookmark className="h-6 w-6 text-green-500" />
              </motion.div>
            </div>

            {/* Left and Right Swipe Indicators */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 ml-2">
              <div className="bg-white/80 rounded-full p-2 shadow-md flex items-center justify-center">
                <ChevronLeft className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 mr-2">
              <div className="bg-white/80 rounded-full p-2 shadow-md flex items-center justify-center">
                <ChevronRight className="h-6 w-6 text-gray-500" />
              </div>
            </div>

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={dragEndHandler}
              style={{ x, rotate, opacity: cardOpacity }}
              animate={direction ? { x: direction === "left" ? -300 : 300 } : undefined}
              className="absolute w-full cursor-grab active:cursor-grabbing"
            >
              <Card className="w-full bg-white shadow-xl">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{currentClause.title}</h3>
                    <p className="text-gray-500">{currentClause.description}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">What this means for you:</h4>
                    <p>{currentClause.implication}</p>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSwipe("left")}
                      className="rounded-full h-12 w-12"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSwipe("right")}
                      className="rounded-full h-12 w-12"
                    >
                      <Bookmark className="h-6 w-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="flex gap-1">
                {policyData.clauses.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 w-6 rounded-full ${
                      index === currentIndex ? "bg-primary" : index < currentIndex ? "bg-gray-400" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <Card className="w-full bg-white shadow-xl">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
              <h3 className="text-xl font-bold mb-4">You've reviewed all policy clauses!</h3>
              {bookmarkedClauses.length > 0 ? (
                <>
                  <p className="text-center mb-6">
                    You've bookmarked {bookmarkedClauses.length} clauses for further review.
                  </p>
                  <div className="w-full space-y-3 mb-6">
                    {bookmarkedClauses.map((id) => {
                      const clause = policyData.clauses.find((c) => c.id === id)
                      return (
                        <div key={id} className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                          <Bookmark className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{clause?.title}</h4>
                            <p className="text-sm text-gray-500">{clause?.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <p className="text-center mb-6">
                  You didn't bookmark any clauses. Would you like to review them again?
                </p>
              )}
              <Button onClick={resetCards}>Review Again</Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-center max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-2">How to use:</h3>
        <p className="text-gray-600 mb-4">
          Swipe right or use the right arrow to bookmark important clauses for later review. Swipe left or use the left
          arrow to skip. You can also use the buttons below each card.
        </p>
      </div>
    </div>
  )
}
