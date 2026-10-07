import { useState } from "react";
import axios from "axios";
import API_URL from "../api";

const Login = ({ onLogin }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [status, setstatus] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();

    seterror("");
    setstatus(true);

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email: email.trim(),
          password: password,
        }
      );

      console.log("Login response:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        onLogin();
      } else {
        seterror(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);

      seterror(
        error.response?.data?.message ||
        "Unable to connect to backend"
      );
    } finally {
      setstatus(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F7F5FC] px-4 py-10 flex items-center justify-center">

      <div className="w-full max-w-md rounded-2xl border border-[#E4DDF5] bg-white p-6 shadow-xl sm:p-8">

        <div className="mb-8 border-b border-[#E8E2F3] pb-6">
          <h2 className="text-3xl font-bold text-[#34215C]">
            Admin Login
          </h2>

          <p className="mt-2 text-sm text-[#756A8A]">
            Login to access the bulk mail system.
          </p>
        </div>

        <form onSubmit={handlesubmit} className="space-y-6">

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-[#49386B]"
            >
              Enter your Email Address
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Enter admin email"
              className="w-full rounded-lg border border-[#D9D0EC] bg-[#FAF9FD] px-4 py-3 text-sm text-[#34215C] outline-none transition placeholder:text-[#9A91AA] focus:border-[#6C4AB6] focus:bg-white focus:ring-2 focus:ring-[#E9E2F8]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-[#49386B]"
            >
              Enter Your Password
            </label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg border border-[#D9D0EC] bg-[#FAF9FD] px-4 py-3 text-sm text-[#34215C] outline-none transition placeholder:text-[#9A91AA] focus:border-[#6C4AB6] focus:bg-white focus:ring-2 focus:ring-[#E9E2F8]"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status}
            className="w-full rounded-lg bg-[#6C4AB6] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#573795] focus:outline-none focus:ring-2 focus:ring-[#B8A5DE] active:scale-[0.99] disabled:opacity-50"
          >
            {status ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </section>
  );
};

export default Login;