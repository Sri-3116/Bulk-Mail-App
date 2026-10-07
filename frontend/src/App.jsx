import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Mailpage from "./components/Mailpage";
import History from "./components/History";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLogin={() => navigate("/send-mail")} />}
      />

      <Route
        path="/send-mail"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-[#F7F5FC]">

              <nav className="border-b border-[#1E3A8A] bg-[#172554] px-4 py-4 text-white shadow-md sm:px-8">

                <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h1 className="text-xl font-bold">
                      Mail Campaign Manager
                    </h1>


                  </div>

                  <div className="flex flex-wrap gap-2">

                    {/* ACTIVE - COMPOSE */}
                    <button
                      onClick={() => navigate("/send-mail")}
                      className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                    >
                      Compose Email
                    </button>

                    {/* HISTORY */}
                    <button
                      onClick={() => navigate("/history")}
                      className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-blue-100 transition hover:bg-[#2563EB] hover:text-white"
                    >
                      Email History
                    </button>

                    {/* LOGOUT */}
                    <button
                      onClick={logout}
                      className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-blue-100 transition hover:bg-[#DC2626] hover:text-white"
                    >
                      Sign Out
                    </button>

                  </div>

                </div>
              </nav>

              <Mailpage />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-[#F7F5FC]">

              <nav className="border-b border-[#1E3A8A] bg-[#172554] px-4 py-4 text-white shadow-md sm:px-8">

                <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h1 className="text-xl font-bold">
                      Mail Campaign Manager
                    </h1>


                  </div>

                  <div className="flex flex-wrap gap-2">

                    {/* SEND MAIL */}
                    <button
                      onClick={() => navigate("/send-mail")}
                      className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-blue-100 transition hover:bg-[#2563EB] hover:text-white"
                    >
                      Send Mail
                    </button>

                    {/* ACTIVE - HISTORY */}
                    <button
                      onClick={() => navigate("/history")}
                      className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                    >
                      Email History
                    </button>

                    {/* LOGOUT */}
                    <button
                      onClick={logout}
                      className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-blue-100 transition hover:bg-[#DC2626] hover:text-white"
                    >
                      Sign Out
                    </button>

                  </div>

                </div>
              </nav>

              <History />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to="/send-mail" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default App;