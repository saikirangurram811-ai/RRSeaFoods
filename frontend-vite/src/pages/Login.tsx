import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../apis/api";

import "./Auth.css";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ move here
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {

        const isLoggedIn =
            localStorage.getItem("isLoggedIn") === "true";

        const token = localStorage.getItem("token");

        const user = localStorage.getItem("user");

        if (isLoggedIn && token && user) {
            navigate("/dashboard");
        }

    }, [navigate]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError("");
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        if (!form.username || !form.password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {

            const res = await loginUser({
                username: form.username,
                password: form.password
            });

            const roles = res.roles || [];

            if (
                !roles.includes("ROLE_SUPER_ADMIN") &&
                !roles.includes("ROLE_ADMIN") &&
                !roles.includes("ROLE_USER")
            ) {

                setError(
                    "You do not have permission to access this application."
                );

                return;
            }

            localStorage.setItem("token", res.accessToken);

            localStorage.setItem(
                "user",
                JSON.stringify(res)
            );

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            setSuccess("Login successful");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

        } catch (err: unknown) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Login failed."
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <button
                    className="back-btn"
                    onClick={() => navigate("/")}
                >
                    ← Back
                </button>

                <div className="auth-header">
                    <h1>Welcome back</h1>
                    <p>Sign in to your account</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="auth-success">
                        {success} — redirecting...
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >

                    <div className="field">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="username"
                        />

                    </div>

                    <div
                        className="field"
                        style={{ position: "relative" }}
                    >

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />

                        <button
                            type="button"
                            className="login-password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? "👁" : "◡"}
                        </button>

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account?
                    {" "}
                    <Link to="/register">
                        Register here
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;