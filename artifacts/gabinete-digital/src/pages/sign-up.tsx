import { SignUp } from "@clerk/react";
import React from "react";

export default function SignUpPage() {
  React.useEffect(() => {
    document.title = "Cadastrar - Gabinete Digital";
  }, []);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-muted/30 py-12">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/portal" />
    </div>
  );
}
