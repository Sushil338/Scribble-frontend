const Navbar = ({ username, onLogout }) => {
    return (
        <header className="border-b border-gray-200 bg-white px-4 py-3">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">Scribble</h1>
                    <p className="text-xs text-gray-500">{username}</p>
                </div>

                <button
                    onClick={onLogout}
                    className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;
