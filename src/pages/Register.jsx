import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { PATHS } from "../routes/paths";
import { cleanUserInput } from "../helpers/utilities";

const checkUsername = (username) => {
  if (username.length < 5) {
    return "Username must be at least 5 characters";
  }
  if (/[^a-zA-Z0-9]/.test(username)) {
    return "Username can only contain letters and numbers";
  }
  // TODO: Add check for existing username via API call
  return null;
}

const checkPassword = (password) => {
  if (password.length < 12) {
    return "Password must be at least 12 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must have at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must have at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must have at least one number";
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return "Password must have at least one special character";
  }
  return null;
}

const checkEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
}

const submitLogin = (e, login, navigate) => {
  e.preventDefault();
  const username = cleanUserInput(e.target.username.value);
  const password = e.target.password.value;

  const usernameError = checkUsername(username);
  if (usernameError) {
    alert(usernameError);
    return;
  }

  const result = login(username, password);
  if (result.ok) {
    navigate(PATHS.ACCOUNT, { replace: true });
  } else {
    alert(result.error);
  }
}

const submitRegister = (e, register, navigate) => {
  e.preventDefault();
  const username = cleanUserInput(e.target.username.value);
  const password = e.target.password.value;
  const email = e.target.email.value.trim().toLowerCase();

  const usernameError = checkUsername(username);
  if (usernameError) {
    alert(usernameError);
    return;
  }

  const passwordError = checkPassword(password);
  if (passwordError) {
    alert(passwordError);
    return;
  }

  const emailError = checkEmail(email);
  if (emailError) {
    alert(emailError);
    return;
  }

  const result = register(username, email, password);
  if (result.ok) {
    navigate(PATHS.ACCOUNT, { replace: true });
  } else {
    alert(result.error);
  }
}

export function Register() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { login, register } = useAuthStore();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {!isLoggedIn && (
        <>
          <div className="mt-4 w-full max-w-md">
            <p className="text-center text-xl">Already have an account?</p>

            <form
              id="login-form"
              className="p-4"
              onSubmit={(e) => submitLogin(e, login, navigate)}
            >
              <label htmlFor="login-username" className="block">
                Username
                <input
                  type="text"
                  name="username"
                  id="login-username"
                  autoComplete="username"
                  required
                  className="mb-4 w-full rounded border bg-white p-2"
                  onKeyUp={(e) => {
                    const checkResult = checkUsername(e.target.value);
                    if (checkResult) {
                      e.target.classList.add("border-rose-500", "outline-rose-500", "invalid");
                      e.target.parentElement.querySelector(".error-message").textContent = checkResult;
                    } else {
                      e.target.classList.remove("border-rose-500", "outline-rose-500", "invalid");
                      e.target.parentElement.querySelector(".error-message").textContent = "";
                    }
                  }}
                />
                <p className="error-message text-sm leading-[100%]"></p>
              </label>
              <label htmlFor="login-password" className="block">
                Password
                <input
                  type="password"
                  name="password"
                  id="login-password"
                  autoComplete="current-password"
                  required
                  className="mb-4 w-full rounded border bg-white p-2"
                />
                <p className="error-message text-sm leading-[100%]"></p>
              </label>

              <button
                type="submit"
                className="mx-auto mt-4 block rounded border border-rose-950 bg-white px-4 py-2 text-rose-950 transition duration-300 ease-in-out hover:bg-rose-100"
              >
                Login
              </button>
            </form>

            <p className="mt-8 text-center text-xl">
              Otherwise, register for a new account:
            </p>

            <form
              id="register-form"
              className="border-minsk-950 text-minsk-950 mt-4 rounded border bg-white p-4"
              onSubmit={(e) => {submitRegister(e, register, navigate)}}
            >
              <label htmlFor="register-username" className="block">
                Username
                <input
                  type="text"
                  name="username"
                  id="register-username"
                  autoComplete="username"
                  required
                  className="mb-4 w-full rounded border p-2"
                  onKeyUp={(e) => {
                    const checkResult = checkUsername(e.target.value);
                    if (checkResult) {
                      e.target.classList.add("border-rose-500", "outline-rose-500", "invalid");
                      e.target.parentElement.querySelector(".error-message").textContent = checkResult;
                    } else {
                      e.target.classList.remove("border-rose-500", "outline-rose-500", "invalid");
                      e.target.parentElement.querySelector(".error-message").textContent = "";
                    }
                  }}
                />
                <p className="error-message text-sm leading-[100%]"></p>
              </label>
              <label htmlFor="register-password" className="block">
                Password
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  autoComplete="new-password"
                  required
                  className="mb-4 w-full rounded border p-2"
                  onKeyUp={(e) => {
                    const checkResult = checkPassword(e.target.value);
                    if (checkResult) {
                      e.target.classList.add("border-rose-500", "outline-rose-500", "invalid");
                      e.target.parentElement.querySelector(".error-message").textContent = checkResult;
                    } else {
                      e.target.classList.remove("border-rose-500", "outline-rose-500", "invalid");
                      e.target.parentElement.querySelector(".error-message").textContent = "";
                    }
                  }}
                />
                <p className="error-message text-sm leading-[100%]"></p>
              </label>
              <label htmlFor="register-email" className="block">
                Email
                <input
                  type="email"
                  name="email"
                  id="register-email"
                  autoComplete="email"
                  required
                  className="mb-4 w-full rounded border p-2"
                  onKeyUp={(e) => {
                    const checkResult = checkEmail(e.target.value);
                    if (checkResult) {
                      e.target.classList.add("border-rose-500", "outline-rose-500", "invalid");
                      e.target.parentElement.querySelector(".error-message").textContent = checkResult;
                    } else {
                      e.target.classList.remove("border-rose-500", "outline-rose-500", "invalid");
                      e.target.parentElement.querySelector(".error-message").textContent = "";
                    }
                  }}
                />
                <p className="error-message text-sm leading-[100%]"></p>
              </label>

              <button
                type="submit"
                className="bg-minsk-500 border-minsk-950 hover:bg-minsk-600 mx-auto mt-4 block w-full rounded border px-4 py-2 text-white transition duration-300 ease-in-out"
              >
                Register
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
