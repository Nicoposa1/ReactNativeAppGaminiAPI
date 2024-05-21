import React, { useState, useRef } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { ChatService } from '../Services/ChatService';
import { Input } from '../component/input';

export const HomeScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef();

  const handleSend = async () => {
    if (!message) return;

    setIsLoading(true);

    try {
      const response = await ChatService(message);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: message, isUser: true },
        { text: response, isUser: false },
      ]);

      flatListRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
    setMessage('');
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageContainer,
                    item.isUser ? styles.userMessageContainer : styles.geminiMessageContainer,
                  ]}>
                  <Text style={styles.messageText}>
                    <Markdown>{item.text}</Markdown>
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              onContentSizeChange={() => flatListRef.current.scrollToEnd()}
            />
          </View>
          <Input
            onSubmit={handleSend}
            setInput={setMessage}
            input={message}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    maxWidth: '80%', // Limita el ancho del mensaje
  },
  messageText: {
  },
  userMessageContainer: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-end',
  },
  geminiMessageContainer: {
    backgroundColor: '#007bff',
    color: '#fff',
    alignSelf: 'flex-start',
  },
});
