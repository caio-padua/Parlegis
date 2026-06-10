import React from "react";
import { AuthenticateWithRedirectCallback, Show } from "@clerk/react";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { AccessGateway } from "@/components/access-gateway";
import { AuthForm } from "@/components/auth-form";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignInPage() {
  React.useEffect(() => {
    document.title = "Entrar - Gabinete Digital";
  }, []);

  const isCallback =
    typeof window !== "undefined" && window.location.pathname.endsWith("/sso-callback");

  const area =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("area") === "admin"
      ? "admin"
      : "eleitor";

  if (isCallback) {
    const redirect = `${basePath}${area === "admin" ? "/admin" : "/portal"}`;
    return (
      <AccessGateway>
        <div className="flex w-full max-w-md items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-[#C99A2E]" />
        </div>
        <AuthenticateWithRedirectCallback
          signInFallbackRedirectUrl={redirect}
          signUpFallbackRedirectUrl={redirect}
        />
      </AccessGateway>
    );
  }

  return (
    <>
      <Show when="signed-in">
        <Redirect to={area === "admin" ? "/admin" : "/portal"} />
      </Show>
      <AccessGateway>
        <AuthForm mode="sign-in" area={area} />
      </AccessGateway>
    </>
  );
}
