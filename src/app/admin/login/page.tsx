"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("邮箱或密码错误");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-80 space-y-4 p-8 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
      >
        <h1 className="text-lg font-medium text-center mb-6">管理后台登录</h1>
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm focus:outline-none focus:border-neutral-500"
          required
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm focus:outline-none focus:border-neutral-500"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
        >
          登录
        </button>
      </form>
    </div>
  );
}
