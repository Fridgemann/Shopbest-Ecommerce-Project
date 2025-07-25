// add popup notifications for success and error messages
// redirect home after successful registration
// auto login after registration
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandInstagram,
  IconBrandX,
} from "@tabler/icons-react";
import { showToast } from "@/components/ui/toast";
import { useAppStore } from '@/store/useAppStore';

export default function SignupFormDemo() {
  const router = useRouter();
  const { refreshUser } = useAppStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for auth
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Registered successfully!", "success");
        setTimeout(async () => {
          await refreshUser();
          router.push('/');
        }, 1200); // Redirect after 1.2 seconds
      } else {
        showToast(data.error || "Registration failed.", "error");
      }
    } catch (err) {
      showToast("Registration failed.", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-2">
      <div className="w-full max-w-md rounded-lg bg-gray-900 p-4 sm:p-6 md:rounded-2xl md:shadow-input md:p-8 border border-blue-700">
        <h2 className="text-2xl font-bold text-blue-400 text-center">
          Welcome to <span className="text-purple-400">ShopBest</span>
        </h2>
        <p className="mt-2 max-w-sm text-sm text-gray-300 text-center mx-auto">
          Create your account below.
        </p>
        <form className="my-6 sm:my-8" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col space-y-2">
            <LabelInputContainer>
              <Label htmlFor="username" className="text-blue-300">
                Username
              </Label>
              <Input
                id="username"
                placeholder="username123"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="text-base py-3 px-3 bg-gray-800 text-white border border-blue-700 placeholder-gray-500 rounded-md"
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email" className="text-blue-300">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="emailhere@mail.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
              className="text-base py-3 px-3 bg-gray-800 text-white border border-blue-700 placeholder-gray-500 rounded-md"
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-blue-700 to-purple-700 font-semibold text-white text-base shadow transition mt-2 cursor-pointer"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>


          <div className="my-6 sm:my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-700 to-transparent" />

          <div className="flex flex-col space-y-3 sm:space-y-4">
            <button
              className="group/btn shadow-input relative flex h-12 w-full items-center justify-center space-x-2 rounded-md bg-gray-800 px-4 font-medium text-blue-200 text-base border border-blue-700 cursor-pointer"
              type="button"
              disabled
            >
              <IconBrandInstagram className="h-5 w-5 text-blue-400" />
              <span className="text-base text-blue-300">Our Instagram</span>
              <BottomGradient />
            </button>
            <button
              className="group/btn shadow-input relative flex h-12 w-full items-center justify-center space-x-2 rounded-md bg-gray-800 px-4 font-medium text-blue-200 text-base border border-blue-700 cursor-pointer"
              type="button"
              disabled
            >
              <IconBrandX className="h-5 w-5 text-blue-400" />
              <span className="text-base text-blue-300">Our X / Twitter</span>
              <BottomGradient />
            </button>
          </div>
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
