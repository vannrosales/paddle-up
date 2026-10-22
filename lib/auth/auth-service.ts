import { createClient } from "@/lib/supabase/client";

export async function signInWithMagicLink(email: string) {
  const supabase = createClient();
  if (!supabase) {
    // Demo mode: set cookie and return success
    document.cookie = `paddleup_demo_user=${encodeURIComponent(email)}; path=/; max-age=604800; SameSite=Lax`;
    return { success: true, message: "Demo login active. Redirecting..." };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, message: "Check your email for the magic link!" };
}

export async function signInWithGoogle() {
  const supabase = createClient();
  if (!supabase) {
    document.cookie = `paddleup_demo_user=demo_google_player@paddleup.app; path=/; max-age=604800; SameSite=Lax`;
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/dashboard";
    return;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function signOutUser() {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  document.cookie = "paddleup_demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/";
}

