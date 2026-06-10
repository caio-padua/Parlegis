import { dark } from "@clerk/themes";

export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#C99A2E",
    colorText: "#F8F3E8",
    colorTextSecondary: "rgba(231,200,115,0.75)",
    colorBackground: "rgba(8, 26, 36, 0.55)",
    colorInputBackground: "rgba(255,255,255,0.05)",
    colorInputText: "#F8F3E8",
    colorTextOnPrimaryBackground: "#10222C",
    colorNeutral: "#F8F3E8",
    borderRadius: "0.9rem",
    fontFamily: "Inter, system-ui, sans-serif",
    fontFamilyButtons: "Inter, system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    card: "rounded-2xl! border! border-[rgba(201,154,46,0.35)]! bg-[rgba(8,26,36,0.72)]! backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)]!",
    headerTitle: "font-serif! text-2xl! text-white!",
    headerSubtitle: "text-[#E7C873]/75!",
    socialButtonsBlockButton:
      "border! border-[rgba(201,154,46,0.4)]! bg-white/[0.04]! hover:bg-white/[0.08]! transition-colors",
    socialButtonsBlockButtonText: "text-white! font-medium!",
    dividerLine: "bg-white/15!",
    dividerText: "text-white/45!",
    formFieldLabel: "text-white/80!",
    formFieldInput:
      "bg-white/[0.06]! border! border-[rgba(201,154,46,0.3)]! text-white! placeholder:text-white/35! focus:border-[#C99A2E]!",
    formButtonPrimary:
      "bg-gradient-to-r! from-[#C99A2E]! to-[#E7C873]! text-[#10222C]! font-semibold! tracking-wide normal-case hover:brightness-105 shadow-[0_8px_24px_-6px_rgba(201,154,46,0.6)]!",
    footer: "bg-transparent!",
    footerActionText: "text-white/55!",
    footerActionLink: "text-[#E7C873]! hover:text-[#C99A2E]!",
    identityPreviewText: "text-white/80!",
    identityPreviewEditButtonIcon: "text-[#E7C873]!",
    formResendCodeLink: "text-[#E7C873]!",
    otpCodeFieldInput: "text-white! border-[rgba(201,154,46,0.3)]!",
    formFieldInputShowPasswordButton: "text-white/60! hover:text-white!",
  },
} as const;
