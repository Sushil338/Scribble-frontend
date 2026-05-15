import { useState } from 'react';

const Login = ({ onLoginSuccess, onGoToRegister }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onLoginSuccess(credentials);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your username and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
            <p className="mt-1 text-sm text-gray-500">Use your Scribble account.</p>

            {error && (
                <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <button
                type="button"
                onClick={onGoToRegister}
                className="mt-4 w-full text-sm text-blue-600"
            >
                Create account
            </button>
        </div>
    );
};

export default Login;
