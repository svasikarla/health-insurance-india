import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { RecommendationForm } from "@/components/recommendation-form"
import { ChatbotButton } from "@/components/chatbot-button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <RecommendationForm />
      </main>
      <ChatbotButton />
      <Footer />
    </div>
  )
}
