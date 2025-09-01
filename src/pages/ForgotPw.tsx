import React, { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../database/supabase_client"; // Make sure you import your client

const ForgotPw = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "myapp://resetPassword"// page user lands after clicking email
    });

    if (error) {
      setMessage(error.message as string);
    } else {
      setMessage("Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div className="bg-bg-color w-full h-screen">
      <div className="flex justify-center items-center h-screen">
        {/* container */}
        <div className="bg-card max-w-[700px] md:h-[400px] shadow-xl shadow-gray-400 w-[95%] flex flex-col justify-between">
          {/* intro */}
          <div>
            <h1 className="font-bold font-pixel text-xl m-2">
              REMAINDER FOR U
            </h1>
          </div>

          {/* form */}
          <div className="flex flex-col m-3 p-3 mx-24 mt-10 gap-10">
            <div>
              <p className="font-extrabold text-lg text-black">
                Reset Password
              </p>
            </div>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b-2 placeholder:text-black text-right placeholder:text-left bg-transparent focus:outline-none border-b-black"
            />
            <div>
              <p className="text-sm text-gray-600 -mt-6">
                **Enter Your Email to reset Password
              </p>
            </div>
            {message && (
              <p className="text-sm text-red-500 mt-2 text-center">{message}</p>
            )}
          </div>

          {/* footer */}
          <div className="flex flex-row justify-between mt-auto">
            <div className="ms-3 mt-7">
              <p className="flex flex-row gap-2">
                Back To
                <Link to={"/login"}>
                  <span className="font-bold">LOG IN</span>
                </Link>
              </p>
            </div>
            <div>
              <button
                onClick={handleReset}
                className="bg-text p-5 px-10 hover:bg-bg-button font-bold hover:text-black text-white"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPw;
