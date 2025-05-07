"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Send } from "lucide-react"
import { useLanguage } from "./language-provider"

type Message = {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  role?: "user" | "assistant" // For OpenAI API
}

// Initial welcome messages for each language
const welcomeMessages: Record<string, string> = {
  english: "Hello! I'm your health insurance assistant. How can I help you today?",
  hindi: "नमस्ते! मैं आपका स्वास्थ्य बीमा सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
  tamil: "வணக்கம்! நான் உங்கள் சுகாதார காப்பீட்டு உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
  telugu: "హలో! నేను మీ ఆరోగ్య బీమా సహాయకుడిని. నేడు నేను మీకు ఎలా సహాయం చేయగలను?",
  bengali: "হ্যালো! আমি আপনার স্বাস্থ্য বীমা সহকারী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
  marathi: "नमस्कार! मी तुमचा आरोग्य विमा सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?",
  gujarati: "નમસ્તે! હું તમારો આરોગ્ય વીમા સહાયક છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?",
  kannada: "ಹಲೋ! ನಾನು ನಿಮ್ಮ ಆರೋಗ್ಯ ವಿಮಾ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
  malayalam: "ഹലോ! ഞാൻ നിങ്ങളുടെ ആരോഗ്യ ഇൻഷുറൻസ് അസിസ്റ്റന്റ് ആണ്. ഇന്ന് എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാൻ കഴിയും?",
  punjabi: "ਹੈਲੋ! ਮੈਂ ਤੁਹਾਡਾ ਸਿਹਤ ਬੀਮਾ ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
}

export function Chatbot() {
  const { language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: welcomeMessages[language] || welcomeMessages.english,
      sender: "bot",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize welcome message
  useEffect(() => {
    // Set the initial welcome message only once
    const initialMessage = {
      id: "1",
      text: welcomeMessages[language] || welcomeMessages.english,
      sender: "bot",
      role: "assistant",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);

    // We don't include any dependencies to ensure this only runs once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle language changes by adding a system message
  const [prevLanguage, setPrevLanguage] = useState(language);
  useEffect(() => {
    // Skip on initial render
    if (prevLanguage === language) return;

    // Add a system message about language change if there's already conversation
    if (messages.length > 1) {
      const languageChangeMessage = {
        id: `lang-change-${Date.now()}`,
        text: welcomeMessages[language] || welcomeMessages.english,
        sender: "bot",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, languageChangeMessage]);
    }

    // Update previous language
    setPrevLanguage(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Prepare conversation history for OpenAI
      const conversationHistory = messages
        .filter(msg => msg.role) // Only include messages with role
        .map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.text
        }))

      // Call our OpenAI API route
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          language,
          conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()

      const botMessage: Message = {
        id: Date.now().toString(),
        text: data.text,
        sender: "bot",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Fallback message in case of error
      const errorMessages: Record<string, string> = {
        english: "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later.",
        hindi: "मुझे खेद है, मुझे अपने ज्ञान आधार से जुड़ने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।",
        tamil: "மன்னிக்கவும், எனது அறிவுத் தளத்துடன் இணைப்பதில் எனக்கு சிரமம் ஏற்படுகிறது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்.",
        // Add fallback messages for other languages as needed
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        text: errorMessages[language] || errorMessages.english,
        sender: "bot",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle voice recording toggle
  const toggleRecording = () => {
    // In a real implementation, this would connect to ElevenLabs API
    // For now, we'll just toggle the state
    setIsRecording(!isRecording)

    if (isRecording) {
      // Simulate stopping recording and getting text
      setTimeout(() => {
        setInput("I want to know more about health insurance plans for my family")
        setIsRecording(false)
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={toggleRecording} className={isRecording ? "bg-red-100" : ""}>
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {isRecording ? "Listening... (powered by ElevenLabs)" : "Press the microphone to speak in your language"}
        </p>
      </div>
    </div>
  )
}
