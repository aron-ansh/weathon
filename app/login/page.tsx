"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SignInCard() {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post("https://api-demo-bice.vercel.app/api/login", { email, password });
      const { msg } = response.data;

      if (msg === "Logged in Successfully") {
        // Set cookie with email as the username
        Cookies.set("user", email, { expires: 7 }); // Cookie expires in 7 days
        router.push("/"); // Redirect to home route
      } else {
        setError("Login failed: " + msg); // Display error message
      }
    } catch (error) {
      setError("An error occurred. Please try again."); // Display general error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#2C5364] via-[#203A43] to-[#0F2027]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div className="mt-4 text-red-500">
                {error}
              </div>
            )}
            <Button type="submit" className="mt-4">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button>Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
