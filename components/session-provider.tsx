import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getSession, removeSession, storeSession } from '../database/storage.config';
import { ANONYMOUS } from '../global';

export function useSession() {
  const value = useContext(SessionContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

const SessionContext = createContext<{
  signIn: (uid: string) => void;
  signOut: () => void;
  session?: string | null;
  isAnonymous?: () => boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isAnonymous: () => false,
});

export const SessionProvider = (props: PropsWithChildren) => {
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const storedSession = await getSession();
      if (storedSession) setSession(storedSession);
    };
    loadSession();
  }, []);

  const signIn = async (session: string) => {
    setSession(session);
    await storeSession(session);
  };

  const signOut = async () => {
    await removeSession();
    setSession(null);
  };

  const isAnonymous = () => {
    return session === ANONYMOUS;
  }

  return (
    <SessionContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isAnonymous
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};
