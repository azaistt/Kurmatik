import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BotMessage, UserMessage } from '../components/chat/message'
import { AI } from '../lib/chat/actions'
import { nanoid } from '../lib/utils'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content: inputText.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const response = await AI.actions.submitUserMessage(userMessage.content)
      const botMessage: ChatMessage = {
        id: response.id,
        role: 'assistant',
        content: typeof response.display === 'string' ? response.display : 'AI yanıt verdi'
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.')
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderMessage = (message: ChatMessage) => {
    if (message.role === 'user') {
      return (
        <View key={message.id} style={styles.userMessageContainer}>
          <Text style={styles.userMessageText}>{message.content as string}</Text>
        </View>
      )
    } else {
      return (
        <View key={message.id} style={styles.botMessageContainer}>
          <Text style={styles.botMessageText}>{message.content as string}</Text>
        </View>
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stock AI Assistant</Text>
        <Text style={styles.headerSubtitle}>Ask me about stocks, prices, and charts</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }, 100)
        }}
      >
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome to Stock AI!</Text>
            <Text style={styles.welcomeText}>
              I'm your AI assistant for financial data and market analysis.
              Ask me about stock prices, charts, or any financial questions.
            </Text>
          </View>
        )}
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about stocks, prices, charts..."
            placeholderTextColor="#666"
            multiline
            maxLength={500}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={[styles.sendButtonText, (!inputText.trim() || isLoading) && styles.sendButtonTextDisabled]}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666'
  },
  messagesContainer: {
    flex: 1
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 12
  },
  userMessageText: {
    backgroundColor: '#007AFF',
    color: '#fff',
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
    fontSize: 16
  },
  botMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: 12
  },
  botMessageText: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
    fontSize: 16
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center'
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center'
  },
  loadingText: {
    color: '#666',
    fontStyle: 'italic'
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  inputWrapper: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-end'
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc'
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  sendButtonTextDisabled: {
    color: '#999'
  }
})