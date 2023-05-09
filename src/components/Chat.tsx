import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

const messages = [
  {
    id: 1,
    type: 'question',
    text: 'Vad händer om skörden blir mindre än tänkt?',
  },
  {
    id: 2,
    type: 'answer',
    text: 'Vi för en kontinuerlig dialog och löser det i så fall tillsammans.',
  },
  {
    id: 3,
    type: 'question',
    text: 'Hur exakt är leveransplanen?',
  },
  // ...fler meddelanden
]
const Chat = () => {
  const [inputText, setInputText] = useState('')
  const handleSendMessage = () => {
    if (!inputText) return
    // Logik för att hantera skickade meddelanden
    // Exempel: lägga till meddelandet i meddelandelistan
    messages.push({
      id: (messages.at(-1)?.id || 0) + 1,
      type: 'question',
      text: inputText,
    })
    setInputText('') // Rensa svarsfältet efter att ha skickat meddelandet
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {messages.map((message) => (
        <View
          key={message.id}
          style={[
            styles.messageContainer,
            message.type === 'question' ? styles.question : styles.answer,
          ]}
        >
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      ))}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Skriv din fråga här..."
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Skicka</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexGrow: 1, // Lägg till denna rad
    justifyContent: 'flex-end', // Lägg till denna rad
  },
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  question: {
    alignSelf: 'flex-start',
    backgroundColor: '#26CC77', // Morotsfärg
  },
  answer: {
    alignSelf: 'flex-end',
    backgroundColor: '#757575', // Grå färg från ditt tema
  },
  messageText: {
    fontSize: 16,
    color: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#26CC77', // Morotsfärg
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
})

export default Chat
