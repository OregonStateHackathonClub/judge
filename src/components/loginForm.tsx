"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Github } from "lucide-react"; // Import Github icon
import { signIn as emailSignIn } from "@/lib/authClient"; // Renamed your custom signIn
import { signIn} from "@/lib/authClient";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="BennyDaBeaver@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              autoComplete="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="bg-orange-500 w-full"
            disabled={loading}
            onClick={async () => {
              // Using your custom email sign-in
              await emailSignIn.email(
                { email, password },
                {
                  onRequest: () => setLoading(true),
                  onResponse: () => setLoading(false),
                  onSuccess: async () => router.push("/"),
                }
              );
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <p>Login</p>}
          </Button>

          {/* Separator */}
          <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          {/* GitHub Sign-In Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn.social({ provider: "github" })}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}