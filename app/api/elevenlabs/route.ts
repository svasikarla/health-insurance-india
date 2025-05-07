import { type NextRequest, NextResponse } from "next/server"
import { ElevenLabsClient } from "elevenlabs"

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
})

// Define voice IDs for different languages
// These are example IDs - you would need to replace with actual voice IDs from your ElevenLabs account
const VOICE_IDS: Record<string, string> = {
  english: "siw1N9V8LmYeEWKyWBxv", // Rachel voice
  hindi: "1qEiC6qsybMkmnNdVMbK",   // Domi voice
  tamil: "izSi63MW0URDnszWlZMX",   // Adam voice
  telugu: "pNInz6obpgDQGcFmaJgB",  // Nicole voice
  bengali: "EXAVITQu4vr4xnSDxMaL", // Bella voice
  marathi: "yoZ06aMxZJJ28mfd3POQ", // Elli voice
  gujarati: "jBpfuIE2acCO8z3wKNLl", // Josh voice
  kannada: "MF3mGyEYCl7XYWbV9V6O", // Matilda voice
  malayalam: "VR6AewLTigWG4xSOukaG", // Sam voice
  punjabi: "ErXwobaYiN019PkySvjV", // Antoni voice
  // Default to English if language not supported
  default: "21m00Tcm4TlvDq8ikWAM", // Rachel voice
}

// Voice settings for better quality
const voiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
}

export async function POST(req: NextRequest) {
  try {
    const { text, language = "english" } = await req.json()

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Get the appropriate voice ID for the language
    const voiceId = VOICE_IDS[language] || VOICE_IDS.default

    try {
      // Generate audio from text using the new API
      const audioResponse = await elevenlabs.generate({
        text,
        voice: voiceId,
        model_id: "eleven_multilingual_v2", // Use multilingual model for better language support
        voice_settings: voiceSettings,
      })

      // Convert audio to base64 for easier handling in the frontend
      // The audioResponse is a ReadableStream, so we need to collect all chunks
      const chunks = []
      for await (const chunk of audioResponse) {
        chunks.push(chunk)
      }

      // Combine all chunks into a single buffer
      const audioBuffer = Buffer.concat(chunks)
      const base64Audio = audioBuffer.toString('base64')

      // Return success response with base64 audio data
      return NextResponse.json({
        success: true,
        message: "Text-to-speech conversion successful",
        audioData: `data:audio/mpeg;base64,${base64Audio}`,
      })
    } catch (apiError) {
      console.error("ElevenLabs API call failed:", apiError)

      // If the API call fails, return a more specific error
      return NextResponse.json({
        error: "Failed to generate speech with ElevenLabs API",
        details: apiError instanceof Error ? apiError.message : "Unknown error"
      }, { status: 500 })
    }
  } catch (error) {
    console.error("ElevenLabs API route error:", error)
    return NextResponse.json({ error: "Failed to convert text to speech" }, { status: 500 })
  }
}
