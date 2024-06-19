import { createContext, PropsWithChildren, useContext } from 'react';
import { useStorageState } from '../database/useStorageState';
import { router } from 'expo-router';

const AuthContext = createContext<{
  signIn: (idTokenString: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: (idToken: string) => {
          setSession(idToken);
          router.replace('/');
          console.log('Logged in as:', idToken);
        },
        signOut: () => {
          setSession(null);
          router.replace('/signin');
          console.log('Logged out');
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
