import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AyushmanBharat } from "@/components/ayushman-bharat"
import { ChatbotButton } from "@/components/chatbot-button"

export default function AyushmanBharatPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ayushman Bharat</h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Learn about India's flagship healthcare scheme providing free access to health insurance for low
                  income earners
                </p>
              </div>
            </div>
          </div>
        </div>
        <AyushmanBharat />
      </main>
      <ChatbotButton />
      <Footer />
    </div>
  )
}
