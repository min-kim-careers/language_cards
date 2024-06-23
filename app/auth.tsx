import { router, useFocusEffect } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import Header from '../components/Header';
import { ELEMENT_WIDTH } from '../global';
import { auth } from '../services/firebase';
import { useSession } from '../components/SessionProvider';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { session, signIn } = useSession();

  useFocusEffect(() => {
    console.log(session);
    
    if (session) {
      router.replace('/');
    }
  });

  // @ts-ignore
  const handleLoginButton = (e) => {
    e.preventDefault();
    setToast('');
    let _email = email.toLowerCase().trim();
    let _password = password;

    if (!_email || !_password) {
      setToast('Please fill in all required fields.');
    } else {
      setLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          signIn(user.uid);
          console.log('Logged in successfully as', user.email);
        })
        .catch((error) => {
          setToast(error.message);
        });
      router.replace('/');
      setLoading(false);
    }
  };

  // @ts-ignore
  const handleSignUpButton = (e) => {
    e.preventDefault();
    setToast('');
    let _email = email.toLowerCase().trim();
    let _password = password;

    if (!_email || !_password) {
      setToast('Please fill in all required fields.');
    } else {
      setLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Created user:', user.uid);
        })
        .catch((error) => {
          setToast(error.message);
        });
      setLoading(false);
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
          mode="outlined"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Email"
        />
      </View>

      <View style={styles.textInput}>
        <TextInput
          mode="outlined"
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

      {/* <View style={styles.hint}>
        <Text>Don't have an account?</Text>
      </View> */}

      <View style={styles.signupButtonContainer}>
        <Button
          mode="outlined"
          onPress={handleSignUpButton}
          disabled={loading}
          labelStyle={styles.signupButton}
        >
          Sign Up
        </Button>
      </View>

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
    gap: 15,
  },
  title: {
    margin: 10,
  },
  header: {
    // margin: 30,
  },
  textInput: {
    width: ELEMENT_WIDTH,
    // gap: 10,
  },
  forgot: {
    // marginTop: 15,
  },
  loginButtonContainer: {
    width: ELEMENT_WIDTH,
    // margin: 15,
  },
  hint: {
    // margin: 10,
  },
  signupButtonContainer: {
    width: ELEMENT_WIDTH,
    // margin: 10,
  },
  signupButton: {
    color: 'black',
  },
});

export default AuthScreen;
