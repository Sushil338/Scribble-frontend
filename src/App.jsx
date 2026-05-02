import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import { LogOut } from 'lucide-react';
import { API, setAuthToken } from './api'; 

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogout = () => {
    localStorage.clear(); 
    setAuthToken(null); 
    // Removed the non-existent resetDashboardState()
    setUser(null);
  };

  if (!user) return isRegistering ? (
    <Register onBackToLogin={() => setIsRegistering(false)} />
  ) : (
    <Login onLoginSuccess={setUser} onGoToRegister={() => setIsRegistering(true)} />
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
      <button 
        onClick={handleLogout} 
        className="mt-4 flex items-center gap-2 p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}

export default App;