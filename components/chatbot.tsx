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
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your health insurance assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

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
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        english: "I understand you're looking for health insurance information. How can I assist you further?",
        hindi: "मुझे समझ में आता है कि आप स्वास्थ्य बीमा जानकारी की तलाश कर रहे हैं। मैं आपकी और कैसे सहायता कर सकता हूं?",
        tamil: "நீங்கள் சுகாதார காப்பீட்டுத் தகவல்களைத் தேடுகிறீர்கள் என்பதை நான் புரிந்துகொள்கிறேன். நான் உங்களுக்கு மேலும் எவ்வாறு உதவ முடியும்?",
        // Add responses for other languages
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponses[language] || botResponses.english,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsProcessing(false)
    }, 1000)
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
