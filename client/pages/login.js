import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();
  const { refreshUser } = useAppStore();

  async function handleLogin(e) {
    e.preventDefault();
    setErr('');

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      await refreshUser();
      router.push('/');
    } catch (err) {
      setErr(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-2">
      <div className="w-full max-w-md rounded-lg bg-gray-900 p-4 sm:p-6 md:rounded-2xl md:shadow-input md:p-8 border border-blue-700">
        <h2 className="text-2xl font-bold text-blue-400 text-center">
          Login to <span className="text-purple-400">ShopBest</span>
        </h2>
        <form className="my-6 sm:my-8" onSubmit={handleLogin}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username" className="text-blue-300">
              Username
            </Label>
            <Input
              id="username"
              placeholder="username123"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="text-base py-3 px-3 bg-gray-800 text-white border border-blue-700 placeholder-gray-500 rounded-md"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password" className="text-blue-300">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="text-base py-3 px-3 bg-gray-800 text-white border border-blue-700 placeholder-gray-500 rounded-md"
            />
          </LabelInputContainer>
          {err && <p className="text-red-500 text-center mb-2">{err}</p>}
          <button
            type="submit"
            className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-blue-700 to-purple-700 font-semibold text-white text-base shadow transition mt-2 cursor-pointer"
          >
            Login &rarr;
            <BottomGradient />
          </button>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
