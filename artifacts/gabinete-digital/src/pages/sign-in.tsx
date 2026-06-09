import { SignIn } from "@clerk/react";
import React from "react";

export default function SignInPage() {
  React.useEffect(() => {
    document.title = "Entrar - Gabinete Digital";
  }, []);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-muted/30">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/portal" />
    </div>
  );
}
