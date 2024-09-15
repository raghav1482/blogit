"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, getProviders } from "next-auth/react"; // Import NextAuth methods
import { Suspense } from "react";
import styles from './login.module.css'; // Import CSS module
import toast, { Toaster } from 'react-hot-toast';

const LoginForm = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Added confirm password for registration
    username: "", // Added username for registration
  });
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and registration
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

  // Handle form submission for email/password login or registration
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (isRegistering) {
      // Registration logic stays the same
      try {
        const response = await fetch(`/api/auth/register`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            username: credentials.username,
            image:`https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`
          }),
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.ok) {
          alert("Registration successful! Please log in.");
          setIsRegistering(false); // Switch to login mode after registration
        } else {
          const error = await response.json();
          toast.error(error.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Use NextAuth signIn for custom login
      const result = await signIn("credentials", {
        redirect: false, // Prevent automatic redirect
        email: credentials.email,
        password: credentials.password,
      });
  
      if (result?.error) {
        // alert(result.error);
        toast.error(result?.error); // Display login errorror)
      } else {
        toast.success("Login Success");
        router.push("/"); // Redirect to home or dashboard on successful login
      }
      setIsSubmitting(false);
    }
  };
  

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" }); // Redirects to home after Google login
  };

  return (
    <Suspense>
      <Toaster />
      <form onSubmit={handleFormSubmit} className={styles["login-form"]}>
        <h1 className={styles["form-title"]}>{isRegistering ? "Register" : "Login"}</h1>

        {/* Username Input (only for registration) */}
        {isRegistering && (
          <div className={styles["form-group"]}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
          </div>
        )}

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

        {/* Confirm Password Input (only for registration) */}
        {isRegistering && (
          <div className={styles["form-group"]}>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={credentials.confirmPassword}
              onChange={(e) =>
                setCredentials({ ...credentials, confirmPassword: e.target.value })
              }
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={submitting} className={styles["black_btn"]}>
          {submitting ? (isRegistering ? "Registering..." : "Logging in...") : isRegistering ? "Register" : "Log In"}
        </button>

        {/* Toggle between login and registration */}
        <p className={styles["toggle-text"]}>
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <span
            className={styles["toggle-link"]}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? " Log In" : " Register"}
          </span>
        </p>

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
