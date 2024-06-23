import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getSession, removeSession, storeSession } from '../database/db.config';

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
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
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

  const signIn = async (uid: string) => {
    setSession(uid);
    await storeSession(uid);
  };

  const signOut = async () => {
    await removeSession();
    setSession(null);
  };

  return (
    <SessionContext.Provider
      value={{
        signIn,
        signOut,
        session,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};
