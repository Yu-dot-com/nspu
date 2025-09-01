import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { password, PasswordSchema } from "../schema/inputSchema";
import supabase from "../database/supabase_client";
import { useUser } from "../hooks/useUser";
import CustomAlert from "../components/CustomAlert";

const ManagePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<password>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { data: UserInfo } = useUser();
  const [message, Setmessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const onSubmit: SubmitHandler<password> = async (data) => {
    console.log(data);
    const { oldPassword, newPassword } = data;
    if (!UserInfo || !UserInfo.email) {
      alert("User not logged in.");
      return;
    }

    const { error: LoginError } = await supabase.auth.signInWithPassword({
      email: UserInfo.email,
      password: oldPassword,
    });
    if (LoginError) {
      Setmessage("Old Password is incorrect");
      setShowAlert(true);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      Setmessage("Error Updating the password");
      setShowAlert(true);
    } else {
      Setmessage("Password Updated successfully");
      setShowAlert(true);
    }
    reset();
  };

  return (
    <div className="bg-card w-full h-[400px] rounded-md  -mt-40 ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col m-14">
          <div className="flex flex-col mt-10">
            <label className="font-bold text-lg text-gray-700">
              Old Password
            </label>
            <input
              type="password"
              {...register("oldPassword")}
              className="mt-3 text-sm font-semibold text-gray-600 focus:outline-none border-b-2 border-b-gray-500 bg-card"
            />
            {errors.oldPassword && (
              <span className="text-[13px]  text-red-800">
                {errors.oldPassword.message as string}
              </span>
            )}
          </div>

          <div className="flex flex-col mt-10">
            <label className="font-bold text-lg text-gray-700">
              New Password
            </label>
            <input
              type="password"
              {...register("newPassword")}
              className="mt-3 text-sm font-semibold text-gray-600 focus:outline-none border-b-2 border-b-gray-500 bg-card"
            />
            {errors.newPassword && (
              <span className="text-[13px]  text-red-800">
                {errors.newPassword.message as string}
              </span>
            )}
          </div>
          <div className="flex flex-col mt-10">
            <label className="font-bold text-lg text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="mt-3 text-sm font-semibold text-gray-600 focus:outline-none border-b-2 border-b-gray-500 bg-card"
            />
            {errors.confirmPassword && (
              <span className="text-[13px]  text-red-800">
                {errors.confirmPassword.message as string}
              </span>
            )}
          </div>
          <div className="flex justify-center mt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-text hover:cursor p-3 rounded-sm text-white  hover:bg-bg-button hover:text-black m-4 w-fit"
            >
              Update
            </button>
          </div>
        </div>
      </form>
      {showAlert && (
        <CustomAlert
          message={message}
          onClose={() => {
            setShowAlert(false);
            Setmessage("");
          }}
        />
      )}
    </div>
  );
};

export default ManagePassword;
