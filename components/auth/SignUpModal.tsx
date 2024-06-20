import { Entypo } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { supabase } from '../../services/supabase';

const Signup = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) setToast(error.message);
    if (!session) setToast('Please check your inbox for email verification!');
    setLoading(false);
  }

  // @ts-ignore
  const handleSubmit = (e) => {
    e.preventDefault();
    setToast('');
    let _email = email.toLowerCase().trim();
    let _password = password;

    if (!_email || !_password) {
      setToast('Please fill in all required fields.');
    } else {
      signUpWithEmail();
    }
  };

  return (
    <Modal animationType="slide" visible={isVisible}>
      <View style={styles.cross}>
        <Entypo name="cross" size={24} color="black" onPress={onClose} />
      </View>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleLarge">Create an account</Text>
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

        <View style={styles.loginButton}>
          <Button
            labelStyle={{ color: 'black' }}
            mode="elevated"
            onPress={handleSubmit}
            disabled={loading}
          >
            Create Account
          </Button>
        </View>

        <View style={styles.hint}>
          <Text>Already have an account?</Text>
        </View>

        <View style={styles.signupButton}>
          <Button mode="contained-tonal" onPress={onClose} disabled={loading}>
            Sign in
          </Button>
        </View>
      </View>

      <Snackbar visible={toast.length !== 0} onDismiss={() => setToast('')}>
        {toast}
      </Snackbar>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  cross: {
    alignItems: 'flex-end',
  },
  header: {
    margin: 30,
  },
  textInput: {
    gap: 10,
  },
  loginButton: {
    margin: 15,
  },
  hint: {
    margin: 10,
  },
  signupButton: {
    margin: 10,
  },
});

export default Signup;
