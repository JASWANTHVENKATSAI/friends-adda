import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOut } from './firebase';
import ChatRoom from './ChatRoom';
import './styles.css';

function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) return <div>Loading...</div>;

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            {user ? (
              <>
                <li><button onClick={signOut}>Sign out</button></li>
              </>
            ) : (
              <li><button onClick={signInWithGoogle}>Sign in with Google</button></li>
            )}
          </ul>
        </nav>
      </header>
      {user ? <ChatRoom /> : <h2>Please sign in to chat</h2>}
      <footer>
        <p>&copy; 2024 Your Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
