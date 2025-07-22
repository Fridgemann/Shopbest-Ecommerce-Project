// pages/login.tsx or login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/');
    } else {
      alert(data.error);
    }
  }

  return (
    <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto bg-black text-white">
      <h1 className="text-xl mb-4">Login</h1>
      <input placeholder="Username" className="mb-4 p-2 w-full bg-gray-800"
        value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" className="mb-4 p-2 w-full bg-gray-800"
        value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-600 px-4 py-2 rounded">Login</button>
    </form>
  );
}
