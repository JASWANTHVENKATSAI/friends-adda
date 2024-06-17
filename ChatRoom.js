import React, { useState, useEffect, useRef } from 'react';
import { auth, firestore } from './firebase';
import firebase from 'firebase/app';

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const unsubscribe = query.onSnapshot((querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setMessages(data);
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    });
    return unsubscribe;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    let fileURL = '';

    if (file) {
      const fileRef = firebase.storage().ref().child(`media/${file.name}`);
      await fileRef.put(file);
      fileURL = await fileRef.getDownloadURL();
      setFile(null);
    }

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      fileURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type a message" />
        <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
        <label htmlFor="file">Upload</label>
        <button type="submit">Send</button>
      </form>
    </>
  );
}

function ChatMessage({ message }) {
  const { text, uid, photoURL, fileURL } = message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://i.pravatar.cc/300'} alt="Avatar" />
      <p>{text}</p>
      {fileURL && <img src={fileURL} alt="Shared Media" className="shared-media" />}
    </div>
  );
}

export default ChatRoom;
