import supabase from "../database/supabase_client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { LoginForm, LoginSchema } from "../schema/inputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomAlert from "../components/CustomAlert";

// type loginForm = {
//   email: string,
//   password: string
// }

const Login = () => {
  const [status, setStatus] = useState("");
  const [message, Setmessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    console.log(data);
    setStatus("Loging into your account");

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    console.log("Trying login with:", data.email, data.password);

    if (error) {
      setStatus("");
      Setmessage("Invalid Credentials");
      setShowAlert(true);
    } else {
      // alert("Welcome to our app");
      Setmessage("WELCOME TO OUR APP");
      setShowAlert(true);
      
    }
  };

  return (
    <div className="bg-bg-color w-full h-screen ">
      <div className="flex justify-center items-center h-screen">
        {/* wholecontainer */}
        <div className="bg-card max-w-[700px] h-[500px] w-[95%] flex flex-col shadow-xl shadow-gray-400 justify-between">
          {/* //intro */}
          <div>
            <h1 className="font-bold font-pixel text-xl m-2">
              REMAINDER FOR U
            </h1>
          </div>

          <div className="w-full h-full flex-1">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col flex-1 h-full justify-between "
            >
              {/* container */}
              <div className="flex flex-col m-3 p-3 mx-24 mt-20">
                <input
                  placeholder="Email"
                  type="text"
                  {...register("email")}
                  className="border-b-2 placeholder:text-black text-right placeholder:text-left bg-transparent focus:outline-none border-b-black"
                />
                {errors.email && (
                  <span className="text-sm text-red-950">
                    {errors.email.message as string}
                  </span>
                )}
                <input
                  placeholder="Password"
                  type="password"
                  {...register("password")}
                  className="border-b-2 placeholder:text-black mt-16 text-right placeholder:text-left bg-transparent focus:outline-none border-b-black"
                />
                {errors.password && (
                  <span className="text-sm text-red-950">
                    {errors.password.message as string}
                  </span>
                )}
                {status && (
                  <p className="font-light text-white text-sm">{status}</p>
                )}



                {/* forgotPw */}
                <div className=" flex flex-row justify-between mt-14">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-white rounded border-gray-900 focus:ring-0"
                    />
                    <span>Stay logged In</span>
                  </label>
                  <Link to={"/forgotPw"}>
                    <h1 className="font-bold">Forgot Password ?</h1>
                  </Link>
                </div>
              </div>

              {/* footer */}
              <div className="flex flex-row justify-between mt-auto">
                <div className="ms-3 mt-7">
                  <p className="flex flex-row gap-2">
                    Dont have an account?{" "}
                    <Link to={"/signup"}>
                      <span className="font-bold">SIGN UP</span>
                    </Link>
                  </p>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-text p-5 font-extrabold px-10 hover:bg-bg-button hover:text-black text-white"
                  >
                    LOG IN
                  </button>
                </div>
              </div>
              {showAlert && (
                <CustomAlert
                  message={message}
                  onClose={() => {
                    setShowAlert(false);
                    navigate("/")
                    Setmessage("");
                  }}
                />
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
