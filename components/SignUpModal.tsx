import { Entypo } from '@expo/vector-icons';
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import { firebaseApp } from '../services/firebase';

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

  // initialised auth instance
  const auth = getAuth(firebaseApp);

  // handle form submit
  // @ts-ignore
  const handleSubmit = (e) => {
    e.preventDefault();
    setToast('');
    let _email = email.toLowerCase().trim();
    let _password = password;

    if (!_email || !_password) {
      setToast('Please fill in all required fields.');
      return;
    }

    createUserWithEmailAndPassword(auth, _email, _password)
      .then((userCredential) => {
        console.log('Created user:', userCredential.user);
      })
      .catch((err) => {
        if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
          setToast('The password is too weak.');
        } else if (err.code === AuthErrorCodes.EMAIL_EXISTS) {
          setToast('The email address is already in use.');
        } else {
          setToast(err.code);
        }
      });
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
          <Button mode="elevated" onPress={handleSubmit}>
            Create Account
          </Button>
        </View>

        <View style={styles.hint}>
          <Text>Already have an account?</Text>
        </View>

        <View style={styles.signupButton}>
          <Button mode="contained-tonal" onPress={onClose}>
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
