import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function SiteLoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-1 flex-col justify-center px-4 py-24 sm:px-6">
      <h1 className="mb-2 text-center text-xl font-bold">
        このサイトは限定公開です
      </h1>
      <p className="mb-6 text-center text-sm text-black/50">
        パスワードを入力してください。
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
