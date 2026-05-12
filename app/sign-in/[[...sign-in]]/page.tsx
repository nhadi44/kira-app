import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "bg-emerald-600 hover:bg-emerald-500 text-sm",
            card: "bg-zinc-900 border border-zinc-800",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton: "bg-zinc-950 border-zinc-800 text-white hover:bg-zinc-800",
            dividerLine: "bg-zinc-800",
            dividerText: "text-zinc-500",
            formFieldLabel: "text-zinc-400",
            formFieldInput: "bg-zinc-950 border-zinc-800 text-white",
            footerActionText: "text-zinc-500",
            footerActionLink: "text-emerald-500 hover:text-emerald-400"
          }
        }}
      />
    </div>
  );
}
