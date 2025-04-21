
import React, { useEffect } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthProfile } from "@/hooks/useAuthProfile";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuthProfile();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (values: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (!error) navigate("/dashboard");
    else alert(error.message);
  };
  const handleSignUp = async (values: { email: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    if (!error) navigate("/dashboard");
    else alert(error.message);
  };
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (!error) navigate("/dashboard");
    else alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/50 to-background p-4">
      {/* <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div> */}
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">LucidNote</CardTitle>
          <CardDescription className="text-center">
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm 
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onGoogleSignIn={handleGoogleSignIn}
          />
        </CardContent>
      </Card>
    </div>
  );
}
