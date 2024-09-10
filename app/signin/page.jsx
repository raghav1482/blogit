"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, getProviders } from "next-auth/react"; // Import NextAuth methods
import { Suspense } from "react";
import styles from './login.module.css'; // Import CSS module

const LoginForm = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [submitting, setIsSubmitting] = useState(false);
  const [providers, setProviders] = useState(null); // State to hold providers like Google

  // Fetch available authentication providers like Google
  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  // Handle form submission for email/password login
  const loginUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/"); // Redirect to home or dashboard on successful login
      } else {
        const error = await response.json();
        alert(error.message); // Handle error response
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" }); // Redirects to home after Google login
  };

  return (
    <Suspense>
      <form onSubmit={loginUser} className={styles["login-form"]}>
        <h1 className={styles["form-title"]}>Login</h1>

        {/* Email Input */}
        <div className={styles["form-group"]}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />
        </div>

        {/* Password Input */}
        <div className={styles["form-group"]}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={submitting} className={styles["black_btn"]}>
          {submitting ? "Logging in..." : "Log In"}
        </button>

        {/* Divider */}
        <div className={styles["divider"]}>or</div>

        {/* Google Sign-In Button */}
        {providers?.google && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={styles["black_btn"]}
          >
            Sign in with Google
          </button>
        )}
      </form>
    </Suspense>
  );
};

export default LoginForm;
