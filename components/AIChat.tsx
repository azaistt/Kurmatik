import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { convertAnyToAll } from '../src/lib/api';
import { CURRENCY_LIST, GOLD_LIST } from '../constants/currencies';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Merhaba! Kurmatik AI asistanınızdayım. Döviz ve altın dönüşümleri hakkında sorularınızı yanıtlayabilirim. Örneğin: "100 USD kaç TRY?"' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Check if it's a conversion query
    const conversionMatch = input.match(/(\d+(?:\.\d+)?)\s*([A-Z]+)\s*(?:kaç|ne kadar|to)\s*([A-Z]+)?/i);
    if (conversionMatch) {
      const amount = parseFloat(conversionMatch[1]);
      const fromCode = conversionMatch[2].toUpperCase();
      const toCode = conversionMatch[3]?.toUpperCase();

      try {
        if (toCode) {
          // Single conversion
          const results = await convertAnyToAll(amount, fromCode);
          const result = results.find((r: any) => r.code === toCode);
          if (result) {
            const response = `${amount} ${fromCode} = ${result.value} ${toCode}`;
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }]);
          } else {
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Üzgünüm, bu dönüşüm için veri bulunamadı.' }]);
          }
        } else {
          // All conversions
          const results = await convertAnyToAll(amount, fromCode);
          const formatted = results.map((r: any) => `${r.label}: ${r.value}`).join('\n');
          const response = `${amount} ${fromCode} dönüşümleri:\n${formatted}`;
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Dönüşüm sırasında hata oluştu.' }]);
      }
    } else {
      // Use Groq AI for general questions
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY || 'your_groq_api_key_here'}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'You are a helpful finance assistant for Kurmatik, focusing on currencies and gold. Keep responses brief and in Turkish.' },
              { role: 'user', content: input }
            ],
            max_tokens: 200
          })
        });

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || 'Üzgünüm, yanıt üretemedim.';
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse }]);
      } catch (error) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'AI yanıtı alınamadı.' }]);
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Finans Asistanı</Text>
      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
        {loading && <Text style={styles.loading}>Yanıt bekleniyor...</Text>}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Sorunuzu yazın..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#101624',
    borderWidth: 1,
    borderColor: '#232b3b',
    marginBottom: 24,
    marginTop: 8,
    width: '100%',
    maxWidth: 600,
    height: 500,
    alignSelf: 'flex-end',
    ...Platform.select({ web: { boxShadow: '0 4px 32px #0002' } }),
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'left',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  message: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#181f33',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  loading: {
    color: '#bfa14a',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#232b3b',
    backgroundColor: '#181f33',
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 14,
  },
  sendButton: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});