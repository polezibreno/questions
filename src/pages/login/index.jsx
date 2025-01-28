import './style.css';
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
};

initializeApp(firebaseConfig);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login realizado com sucesso!");
      setMessageType("success");
    } catch (error) {
      setMessage("Erro ao fazer login. Verifique suas credenciais.");
      setMessageType("error");
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, provider);
      setMessage("Login com Google realizado com sucesso!");
      setMessageType("success");
    } catch (error) {
      setMessage("Erro ao fazer login com Google.");
      setMessageType("error");
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleLogin}>
        <h1>Entre no Questions</h1>
        <input
          className='input-field'
          type="email"
          placeholder='E-mail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className='input-field'
          type="password"
          placeholder='Senha'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className='butao'>
          <button className='botao' type="submit">
            Login
          </button>
          <button className='botao' type="button" onClick={handleGoogleLogin}>
            Login com Google
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
