import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export function Account() {
  // TODO: destructure what you need from useAuthStore()
  // TODO: set up state for username and mode

  const { isLoggedIn, user } = useAuthStore();
  const gray_gradient_button_classes =
    "grid grid-cols-[1fr_2fr] gap-x-4 border-minsk-500 rounded-full px-6 py-4 rounded border bg-gray-100 px-4 py-2 text-black transition duration-300 ease-in-out hover:bg-gray-200";
  const input_field_classes =
    "text-minsk-700 rounded-l-none border-white rounded-3xl border bg-white p-2 text-center";
  const label_field_classes =
    "label thead h-full content-center text-center rounded-r-none w-full rounded-3xl p-2 text-center";

  return (
    <div
      id="custom-container"
      className="mt-30 mx-auto w-full max-w-4xl rounded-2xl bg-white text-center shadow-lg"
    >

      {!isLoggedIn && (
        <p className="text-xl">You must be logged in to view this page.</p>
      )}

      {isLoggedIn && (
        <>
          <h1 className="page-heading m-0 p-0 text-2xl">
            Welcome to your account page!
          </h1>

          <div className="py-12">
            <div className="inline-grid w-auto gap-y-4 text-left">
              <div className="gray-button">
                <div className={label_field_classes}>Username:</div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={user.username}
                  className={input_field_classes}
                />
              </div>

              <div className="gray-button">
                <div className={label_field_classes}>Email:</div>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={user.email}
                  className={input_field_classes}
                />
              </div>

              <div className="gray-button">
                <div className={label_field_classes}>Current Password:</div>
                <input
                  type="password"
                  name="currentPassword"
                  value="********"
                  className={input_field_classes}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
