import React, { useEffect, useState } from "react";
import supabase from "../database/supabase_client";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    if (window.electronAPI?.onDeepLink) {
      window.electronAPI.onDeepLink((url: string) => {
        console.log("Deep link received:", url);

        // Extract hash part (after #)
        const hash = url.split("#")[1];
        if (!hash) return;

        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          // Set Supabase session
          supabase.auth
            .setSession({ access_token, refresh_token })
            .then(({ error }) => {
              if (error) setMessage(error.message as string);
              else setTokenReady(true);
            });
        }
      });
    }
  }, []);

  const handleReset = async () => {
    if (!password) return setMessage("Enter a new password");

    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message as string);
    else setMessage("Password updated! You can now log in.");
  };

  if (!tokenReady) return <p>Waiting for reset link...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1>Set New Password</h1>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <button onClick={handleReset} className="bg-green-500 text-white p-2 rounded">
        Update Password
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
