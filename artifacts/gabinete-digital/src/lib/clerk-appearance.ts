import { dark } from "@clerk/themes";

export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#C99A2E",
    colorText: "#F8F3E8",
    colorTextSecondary: "rgba(248,243,232,0.65)",
    colorBackground: "transparent",
    colorInputBackground: "rgba(255,255,255,0.05)",
    colorInputText: "#F8F3E8",
    colorTextOnPrimaryBackground: "#10222C",
    colorNeutral: "#F8F3E8",
    borderRadius: "0.75rem",
    fontFamily: "Inter, system-ui, sans-serif",
    fontFamilyButtons: "Inter, system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent! shadow-none! border-0! p-0! w-full!",
    headerTitle: "font-serif! text-2xl! text-white!",
    headerSubtitle: "text-white/55!",
    socialButtonsBlockButton:
      "h-11! rounded-xl! border! border-[rgba(201,154,46,0.4)]! bg-white/[0.04]! hover:bg-white/[0.09]! transition-colors",
    socialButtonsBlockButtonText: "text-white! font-medium!",
    dividerLine: "bg-white/12!",
    dividerText: "text-white/40!",
    formFieldLabel: "text-white/75! font-medium!",
    formFieldInput:
      "h-11! rounded-xl! bg-white/[0.05]! border! border-[rgba(201,154,46,0.28)]! text-white! placeholder:text-white/35! focus:border-[#C99A2E]! focus:ring-2! focus:ring-[#C99A2E]/35!",
    formButtonPrimary:
      "h-11! rounded-xl! bg-gradient-to-r! from-[#C99A2E]! to-[#E7C873]! text-[#10222C]! font-semibold! tracking-wide normal-case hover:brightness-105 shadow-[0_10px_28px_-10px_rgba(201,154,46,0.7)]!",
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
