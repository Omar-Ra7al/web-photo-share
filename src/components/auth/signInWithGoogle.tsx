"use client";
import { signInWithGoogle } from "@/lib/firebase/auth";

const SignInWithGoogle = () => {
  return (
    <button className="btn btn-primary bg-cyan-800" onClick={signInWithGoogle}>
      <span>Sign in with Google</span>
    </button>
  );
};

export default SignInWithGoogle;
