import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <AuthPage onLoginSuccess={login} />;
  }

  return <Dashboard user={user} onLogout={logout} />;
}

export default App;
