import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ClaimRejectionPredictor } from "@/components/claim-rejection-predictor"
import { ChatbotButton } from "@/components/chatbot-button"

export default function ClaimRejectionPredictorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Claim Rejection Predictor
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Upload your policy and provide case details to predict claim rejection probability
                </p>
              </div>
            </div>
          </div>
        </div>
        <ClaimRejectionPredictor />
      </main>
      <ChatbotButton />
      <Footer />
    </div>
  )
}
