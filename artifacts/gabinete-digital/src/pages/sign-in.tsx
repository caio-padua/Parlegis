import { SignIn } from "@clerk/react";
import React from "react";
import { AccessGateway } from "@/components/access-gateway";

export default function SignInPage() {
  React.useEffect(() => {
    document.title = "Entrar - Gabinete Digital";
  }, []);

  const redirectUrl =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("area") === "admin"
      ? "/admin"
      : "/portal";

  return (
    <AccessGateway mode="sign-in">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl={redirectUrl} />
    </AccessGateway>
  );
}
