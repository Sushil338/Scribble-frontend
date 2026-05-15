import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Register = ({ onBackToLogin }) => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await register(formData);
            setSuccess('Account created. You can login now.');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Register</h1>
            <p className="mt-1 text-sm text-gray-500">Create a simple Scribble account.</p>

            {error && (
                <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
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
                        value={formData.password}
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
                    {loading ? 'Creating...' : 'Register'}
                </button>
            </form>

            <button
                type="button"
                onClick={onBackToLogin}
                className="mt-4 w-full text-sm text-blue-600"
            >
                Back to login
            </button>
        </div>
    );
};

export default Register;
