import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "管理画面ログイン",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-4 py-24 sm:px-6">
      <h1 className="mb-6 text-center text-2xl font-bold">管理画面ログイン</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
