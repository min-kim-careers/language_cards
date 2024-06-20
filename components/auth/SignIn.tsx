// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import { supabase } from '../../services/supabase';
import Header from '../Header';
import Signup from './SignUpModal';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [isSignupModalVisible, setIsSignupModalVisible] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) setToast(error.message);
    setLoading(false);
  }

  // @ts-ignore
  const handleLoginButton = (e) => {
    e.preventDefault();
    setToast('');
    let _email = email.toLowerCase().trim();
    let _password = password;

    if (!_email || !_password) {
      setToast('Please fill in all required fields.');
    } else {
      signInWithEmail();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Header isTitle={true} />
      </View>

      <View style={styles.header}>
        <Text variant="titleLarge">Sign In</Text>
      </View>

      <View style={styles.textInput}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Email"
        />
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
        />
      </View>

      <View style={styles.loginButtonContainer}>
        <Button
          labelStyle={{ color: 'black' }}
          mode="elevated"
          onPress={handleLoginButton}
          disabled={loading}
        >
          Login
        </Button>
      </View>

      <View style={styles.hint}>
        <Text>Don't have an account?</Text>
      </View>

      <View style={styles.signupButton}>
        <Button
          mode="contained-tonal"
          onPress={() => setIsSignupModalVisible(true)}
          disabled={loading}
        >
          Sign Up
        </Button>
      </View>

      <Signup
        isVisible={isSignupModalVisible}
        onClose={() => setIsSignupModalVisible(false)}
      />

      <Portal>
        <Snackbar visible={toast.length !== 0} onDismiss={() => setToast('')}>
          {toast}
        </Snackbar>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    margin: 10,
  },
  header: {
    margin: 30,
  },
  textInput: {
    gap: 10,
  },
  forgot: {
    marginTop: 15,
  },
  loginButtonContainer: {
    margin: 15,
  },
  hint: {
    margin: 10,
  },
  signupButton: {
    margin: 10,
  },
});

export default SignIn;
