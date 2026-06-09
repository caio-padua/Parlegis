import { SignUp } from "@clerk/react";
import React from "react";
import { AccessGateway } from "@/components/access-gateway";

export default function SignUpPage() {
  React.useEffect(() => {
    document.title = "Criar acesso - Gabinete Digital";
  }, []);

  return (
    <AccessGateway mode="sign-up">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/portal" />
    </AccessGateway>
  );
}
