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
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (isLoggedIn && token && user) {
            navigate("/dashboard");
        }
    }, [navigate]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setError("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.username || !form.password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await loginUser({
                username: form.username.trim(),
                password: form.password
            });

            const roles = res.roles && res.roles.length > 0
                ? res.roles
                : [(res as any).role || "ROLE_USER"];

            if (
                !roles.includes("ROLE_SUPER_ADMIN") &&
                !roles.includes("ROLE_ADMIN") &&
                !roles.includes("ROLE_USER")
            ) {
                setError("You do not have permission to access this application.");
                return;
            }

            localStorage.setItem("token", res.accessToken);
            localStorage.setItem("user", JSON.stringify(res));
            localStorage.setItem("isLoggedIn", "true");

            setSuccess("Login successful");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed.");
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
                    type="button"
                >
                    ← Back
                </button>

                <div className="auth-header">
                    <h1>Welcome back</h1>
                    <p>Sign in to your account</p>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success} — redirecting...</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="field">
                        <label htmlFor="username">Username or Email</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username or email"
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="field" style={{ position: "relative" }}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />

                        <button
                            type="button"
                            className="login-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "👁" : "◡"}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
