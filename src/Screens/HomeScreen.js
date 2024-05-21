import {
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import { ChatService } from '../Services/ChatService';

export const HomeScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (!message) return;

    setIsLoading(true);

    try {
      const response = await ChatService(message);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: message, isUser: true },
      ]);

      setMessages(prevMessages => [
        ...prevMessages,
        { text: response, isUser: false },
      ]);

      scrollViewRef.current.scrollToEnd();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ScrollView
        style={styles.messagesList}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd()}>
        {messages.map((msg, index) => (
          <Text
            key={index}
            style={[
              styles.message,
              msg.isUser ? styles.userMessage : styles.geminiMessage,
            ]}>
            <Markdown>{msg.text}</Markdown>
          </Text>
        ))}
        {isLoading && <Text>Loading...</Text>}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          multiline
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  userMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-end',
  },
  geminiMessage: {
    backgroundColor: '#007bff',
    color: '#fff',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    maxHeight: 150,
  },
});
