import supabase from "../database/supabase_client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { SignUpForm, SignUpSchema } from "../schema/inputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomAlert from "../components/CustomAlert";

// type SignUpForm = {
//   name: string;
//   email: string;
//   password: string;
// };

const SignUp = () => {
  const [showAlert,setShowAlert]=useState(false);
  const [message,Setmessage]=useState("");
  const navigate=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<SignUpForm>({ resolver: zodResolver(SignUpSchema) });
  const [status, setStatus] = useState("");

  const onSubmit: SubmitHandler<SignUpForm> = async (data: SignUpForm) => {
    setStatus("Creating Account...");

    const { data: existingUserData, error: existingUserError } = await supabase
  .from("users")
  .select("id")
  .eq("email", data.email)
  .limit(1);

if (existingUserError) {
  Setmessage('Something went wrong');
  setShowAlert(true);
 console.log(existingUserError.message as string);
  return;
}

if (existingUserData && existingUserData.length > 0) {
  Setmessage("Email is already registered");
  setShowAlert(true);
  return;
}


    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        Setmessage("Sign Up Failed");
        setShowAlert(true);
        setStatus("Something went wrong");
        return;
      }

      if (!authData.user) {
        Setmessage("User Creation Failed");
        setShowAlert(true);
       
        return;
      }

      const { error: insertError } = await supabase.from("users").insert({
        id: authData.user.id,
        name: data.name,
        email: data.email,
      });

      if (insertError) {
        Setmessage("Something went wrong");
        setShowAlert(true);
        console.log("Failed to save user profile: " + insertError.message as string);
        return;
      }
      Setmessage("Signup successful!");
        setShowAlert(true);
 
      setStatus("Account created");
    } catch (error) {
   Setmessage("Something went wrong");
        setShowAlert(true);
      console.log(error);
    }
  };
  return (
    <div className="bg-bg-color w-full h-screen ">
      <div className="flex justify-center items-center h-screen">
        {/* comtainer */}
        <div className="bg-card max-w-[700px] md:h-[600px] w-[95%] shadow-xl shadow-gray-400 flex flex-col justify-between">
          {/* //intro */}
          <div>
            <h1 className="font-bold font-pixel text-xl m-2">
              REMAINDER FOR U
            </h1>
          </div>

          <div className="flex flex-col flex-1 ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-1 flex-col h-full justify-between"
            >
              {/* container */}
              <div className="flex flex-col mt-28 m-3 p-3 mx-24">
                <input
                  placeholder="UserName"
                  type="text"
                  {...register("name")}
                  className="border-b-2 placeholder:text-black text-right placeholder:text-left bg-transparent focus:outline-none border-b-black"
                />
                {errors.name && (
                  <span className="text-sm text-red-950">
                    {errors.name.message as string}
                  </span>
                )}
                <input
                  placeholder="Email"
                  type="text"
                  {...register("email")}
                  className="border-b-2 mt-16 placeholder:text-black text-right placeholder:text-left bg-transparent focus:outline-none border-b-black"
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
                  className="border-b-2 mt-16 placeholder:text-black text-right placeholder:text-left bg-transparent focus:outline-none border-b-black"
                />
                {errors.password && (
                  <span className="text-sm text-red-950">
                    {errors.password.message as string}
                  </span>
                )}
                {/* {status && <p className="font-light text-white text-sm -mt-14">{status}</p>} */}
              </div>

              {/* footer */}
              <div className="flex flex-row justify-between mt-auto">
                <div className="ms-3 mt-7">
                  <p className="flex flex-row gap-2">
                    Already have an account?{" "}
                    <Link to={"/login"}>
                      <span className="font-bold">LOG IN</span>
                    </Link>
                  </p>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-text p-5 px-10 hover:bg-bg-button font-bold hover:text-black text-white"
                  >
                    SIGN UP
                  </button>
                </div>
              </div>
              {
                showAlert && 
                <CustomAlert  message={message} onClose={
                  ()=>{
                    setShowAlert(false);
                    Setmessage('');
                    navigate('/login');
                  }
                }/>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
