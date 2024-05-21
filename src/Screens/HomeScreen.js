import React, {useState, useRef} from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {ChatService} from '../Services/ChatService';
import {Input} from '../component/input';

export const HomeScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef();

  const handleSend = async () => {
    if (!message) return;
    setMessage('');
    setIsLoading(true);

    try {
      const response = await ChatService(message);
      setMessages(prevMessages => [
        ...prevMessages,
        {text: message, isUser: true},
        {text: response, isUser: false},
      ]);

      ScrollView.current.scrollToEnd({animated: true});
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            padding: 10,
            backgroundColor: '#f0f0f0',
          }}>
            <ScrollView>

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
            </ScrollView>
        </View>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 100}>
          <SafeAreaView style={styles.container}>
            <Input
              onSubmit={handleSend}
              setInput={setMessage}
              input={message}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 10,
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  geminiMessage: {
    color: '#fff',
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    maxHeight: 150,
  },
});
