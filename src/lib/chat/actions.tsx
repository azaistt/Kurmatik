// Simplified AI actions for Kurmatik integration
// This is a mock implementation - full Vercel AI SDK would require more setup

import { BotMessage } from '../../components/chat/message'
import { nanoid } from '../utils'

export type AIState = {
  chatId: string
  messages: any[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

// Mock AI state management
let mockAIState: AIState = { chatId: nanoid(), messages: [] }

const getMockAIState = () => mockAIState
const updateMockAIState = (newState: Partial<AIState>) => {
  mockAIState = { ...mockAIState, ...newState }
}

async function submitUserMessage(content: string) {
  'use server'

  updateMockAIState({
    messages: [
      ...getMockAIState().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  // Simple mock response based on content
  let responseContent = "I'm a stock analysis AI. I can help you with stock prices, charts, and market information."

  if (content.toLowerCase().includes('price') || content.toLowerCase().includes('fiyat')) {
    responseContent = "I can show you stock prices. Try asking for a specific stock symbol like 'AAPL' or 'TSLA'."
  } else if (content.toLowerCase().includes('chart') || content.toLowerCase().includes('grafik')) {
    responseContent = "I can display interactive stock charts. Ask me to show a chart for any stock symbol."
  } else if (content.toLowerCase().includes('currency') || content.toLowerCase().includes('döviz')) {
    responseContent = "I can help with currency exchange rates and financial data. Your Kurmatik app already handles currency conversion!"
  }

  updateMockAIState({
    messages: [
      ...getMockAIState().messages,
      {
        id: nanoid(),
        role: 'assistant',
        content: responseContent
      }
    ]
  })

  return {
    id: nanoid(),
    display: <BotMessage content={responseContent} />
  }
}

export const AI = {
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] }
}