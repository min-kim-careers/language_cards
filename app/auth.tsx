import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Portal, Snackbar, TextInput } from 'react-native-paper';
import { useSession } from '../components/session-provider';
import Logo from '../components/logo';
import { ANONYMOUS, ELEMENT_WIDTH } from '../constants/global';
import { addNewUser } from '../database/supabase.config';
import { auth } from '../services/firebase';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { session, signIn } = useSession();

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, []);

  // @ts-ignore
  const handleLoginButton = (e) => {
    e.preventDefault();
    setToast('');
    let _email = email.toLowerCase().trim();
    let _password = password;

    if (!_email || !_password) {
      setToast('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setToast(`Welcome ${email}!`);
        const user = userCredential.user;
        signIn(user.uid);
        console.log('Logged in successfully as', user.email);

        setTimeout(() => {
          setLoading(false);
          router.replace('/');
        }, 1500);
      })
      .catch((error) => {
        setToast(error.message);
        setLoading(false);
      });
  };

  // @ts-ignore
  const handleSignUpButton = (e) => {
    e.preventDefault();
    setToast('');
    let _email = email.toLowerCase().trim();
    let _password = password;

    if (!_email || !_password) {
      setToast('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (!addNewUser(user.uid)) throw new Error('Failed to add new user');
      })
      .catch((error) => {
        setToast(error.message);
        setLoading(false);
      });
  };

  // // @ts-ignore
  // const handleAnonymousButton = (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   signInAnonymously(auth)
  //     .then(() => {
  //       console.log('Logged in anonymously');
  //       signIn(ANONYMOUS);

  //       setTimeout(() => {
  //         setLoading(false);
  //         router.replace('/');
  //       }, 1500);
  //     })
  //     .catch((error) => {
  //       setToast(error.message);
  //       setLoading(false);
  //     });
  // };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Logo isTitle />
      </View>

      <View style={styles.textInput}>
        <TextInput
          mode='outlined'
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder='Email'
        />
      </View>

      <View style={styles.textInput}>
        <TextInput
          mode='outlined'
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder='Password'
        />
      </View>

      <View style={styles.loginButtonContainer}>
        <Button
          labelStyle={styles.loginButton}
          mode='elevated'
          onPress={handleLoginButton}
          disabled={loading}
          loading={loading}
        >
          {!loading && `Log in`}
        </Button>
      </View>

      <View style={styles.signupButtonContainer}>
        <Button
          labelStyle={styles.signupButton}
          mode='outlined'
          onPress={handleSignUpButton}
          disabled={loading}
          loading={loading}
        >
          {!loading && `Sign Up`}
        </Button>
      </View>

      {/* <View style={styles.anonymousButtonContainer}>
        <Button
          labelStyle={styles.anonymousButton}
          mode='outlined'
          onPress={handleAnonymousButton}
          disabled={loading}
          loading={loading}
        >
          {!loading && `Sign in without an account`}
        </Button>
      </View> */}

      <Portal>
        <Snackbar
          visible={toast.length !== 0}
          onDismiss={() => setToast('')}
        >
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
  textInput: {
    width: ELEMENT_WIDTH,
  },
  forgot: {},
  loginButtonContainer: {
    width: ELEMENT_WIDTH,
  },
  loginButton: {
    alignContent: 'center',
    height: 20,
    color: 'black',
  },
  signupButtonContainer: {
    width: ELEMENT_WIDTH,
  },
  signupButton: {
    alignContent: 'center',
    height: 20,
    color: 'black',
  },
  anonymousButtonContainer: {
    width: ELEMENT_WIDTH,
  },
  anonymousButton: {
    alignContent: 'center',
    height: 20,
  },
});

export default AuthScreen;
