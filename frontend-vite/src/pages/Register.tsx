import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../apis/api";
import { getEmailError, getMobileError, getPasswordError, validatePassword } from "../apis/validations";
import "./Auth.css";

function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const token = localStorage.getItem("token");
        console.log('hi', token);
        const user = localStorage.getItem("user");
        if (isLoggedIn && token && user) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const [form, setForm] = useState({ username: "", firstname: "", lastname: "", email: "", mobile: "", password: "", confirmpassword: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const emailError = getEmailError(form.email);
        if (emailError) {
            setError(emailError);
            return;
        }

        const mobileError = getMobileError(form.mobile);
        if (mobileError) {
            setError(mobileError);
            return;
        }

        const passwordError = getPasswordError(form.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (form.password !== form.confirmpassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            const res = await registerUser({ username: form.username, firstname: form.firstname, lastname: form.lastname, email: form.email, password: form.password, confirmpassword: form.confirmpassword, mobile: form.mobile });
            setSuccess(res.message);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <button className="back-btn" onClick={() => navigate("/")}>← Back</button>

                <div className="auth-header">
                    <h1>Create account</h1>
                    <p>Join us — it only takes a minute</p>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success} — redirecting...</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="field">
                        <label htmlFor="name">User name</label>
                        <input id="username" name="username" type="text" placeholder="Enter username here" required
                            value={form.username} onChange={handleChange} autoComplete="username" />
                    </div>
                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="name">First name</label>
                            <input id="firstname" name="firstname" type="text" placeholder="Enter firstname here" required
                                value={form.firstname} onChange={handleChange} autoComplete="firstname" />
                        </div>
                        <div className="field">
                            <label htmlFor="name">Last name</label>
                            <input id="lastname" name="lastname" type="text" placeholder="Enter lastname here" required
                                value={form.lastname} onChange={handleChange} autoComplete="lastname" />
                        </div>
                    </div>
                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input id="email" name="email" type="text" placeholder="you@example.com"
                                value={form.email} onChange={handleChange} autoComplete="email" />
                        </div>
                        <div className="field">
                            <label htmlFor="email">Mobile No.</label>
                            <input id="mobile" name="mobile" type="text" placeholder="Enter Mobile No."
                                value={form.mobile} maxLength={10} onChange={handleChange} autoComplete="mobile" />
                        </div>
                    </div>
                    <div className="field-row">
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
                                type={showPassword ? "text" : "password"}
                                placeholder="Create Strong password"
                                value={form.password}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁" : "◡"}
                            </button>
                        </div>
                        <div
                            className="field"
                            style={{ position: "relative" }}
                        >
                            <label htmlFor="confirmpassword">
                                Confirm password
                            </label>

                            <input
                                id="confirmpassword"
                                name="confirmpassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={form.confirmpassword}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? "👁" : "◡"}
                            </button>
                        </div>
                    </div>
                    {form.password.length > 0 && !validatePassword(form.password) && (
                        <p className="password-reqs" style={{ marginTop: '10px' }}>
                            <>⚠️Password Must Start's with Capital Letter, Contains Atleast one Special Character and Number.</>
                        </p>
                    )}

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
        </div>
    );
}

export default Register;