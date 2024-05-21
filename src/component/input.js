import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import styles from './styles';

export const Input = ({onSubmit, setInput, input}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        onChangeText={setInput}
        value={input}
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity onPress={onSubmit} style={{
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image
          style={styles.icon}
          tintColor={'#007bff'}
          source={require('../assets/send-message.png')}
        />
      </TouchableOpacity>
    </View>
  );
};