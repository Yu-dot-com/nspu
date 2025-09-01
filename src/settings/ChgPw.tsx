import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { profile, UserSchema } from "../schema/inputSchema";
import Avatar from "./Avatar";
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";
import { useDepartment } from "../hooks/useDepartment";
import supabase from "../database/supabase_client";
import ManagePassword from "./ManagePassword";
import profileImg from "../images/user.png";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";

const Profile = () => {


  const { data: UserData, error: UserError, refetch } = useUser();
  const { data: Ddata, error: Derror } = useDepartment();
  const [avatar, setavatar] = useState<string>(
    UserData?.avatar_url ? UserData?.avatar_url : profileImg
  );
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [message, Setmessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isLoading },
  } = useForm<profile>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      university: "",
    },
  });

  const department = Ddata?.find((d) => {
    return d.id === UserData?.department_id;
  });
  const departmentName = department?.name || "";

  const onSubmit: SubmitHandler<profile> = async (data) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          university: data.university,
        })
        .eq("id", UserData.id);
      if (error) {
        Setmessage("Error updating info");
        setShowAlert(true);
        console.log(error);
        return;
      }
    } catch (error) {
      Setmessage("Something went Wrong");
      setShowAlert(true);
      return;
    }
    Setmessage("Update Success");
    setShowAlert(true);
    refetch();
  };

  useEffect(() => {
    if (UserData) {
      reset({
        name: UserData.name ?? "",
        email: UserData.email ?? "",
        phone: UserData.phone ?? "",
        university: UserData.university ?? "",
      });
    }
  }, [UserData, reset]);

  useEffect(() => {
    if (UserData?.avatar_url) {
      setavatar(UserData.avatar_url);
    }
  }, [UserData]);

  const watchValues = watch();
  const isSame =
    UserData?.name === watchValues.name &&
    UserData?.email === watchValues.email &&
    UserData?.phone === watchValues.phone &&
    UserData?.university === watchValues.university;

  const imageOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return; // no file selected, exit early

    const reader = new FileReader();
    reader.onload = () => {
      setSelectFile(file);
      if (reader.readyState === 2) {
        setavatar(reader.result as string);
      }
    };

    reader.readAsDataURL(file);
  };

  const ImageUpload = async () => {
    if (!selectFile || !UserData.id) {
      Setmessage("please select an image");
      setShowAlert(true);
      return;
    }

    try {
      const userId = UserData.id;
      const fileExt = selectFile.name.split(".").pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { data: PfData, error: PFerror } = await supabase
        .from("users")
        .select("avatar_url")
        .eq("id", UserData.id)
        .single();

      if (PfData.avatar_url) {
        const oldFPath = PfData.avatar_url;
        const oldFilePath = `${userId}/${oldFPath.split("/").pop()}`;
        console.log("Old Pic", oldFilePath);
        if (oldFilePath) {
          const {error: oldError,data } = await supabase.storage
            .from("avatar")
            .remove([oldFilePath]);
            if(data){
              console.log('hii',data);
            }
          if (oldError) {
            console.warn("Failed to delete old avatar:", oldError);
          }
        }
      }

      const { error: UploadError } = await supabase.storage
        .from("avatar")
        .upload(filePath, selectFile, { upsert: true });
      if (UploadError) {
        throw UploadError;
      }

      const { data: url } = supabase.storage
        .from("avatar")
        .getPublicUrl(filePath);
      // if(urlError){
      //   throw urlError
      // }
      if (!url) {
        throw new Error("Failed to get public Url");
      }

      setavatar(url.publicUrl);

      const { error: UpdateError } = await supabase
        .from("users")
        .update({ avatar_url: url.publicUrl })
        .eq("id", userId);
      if (UpdateError) {
        alert("Failed uploading avatar");
      }
      Setmessage("Avatar Uploaded Successfully");
      setShowAlert(true);
      refetch();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Setmessage("Failed to Upload Avatar");
      setShowAlert(true);
    }
  };

  return (
    <div className="">
      {/* main */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5 flex flex-row gap-3 w-full h-screen">
          {/* pic */}
          <div className="h-4/5 w-1/2 bg-card flex flex-col rounded-md items-center justify-center">
            <img
              className="w-28 h-28 rounded-full overflow-hidden"
              src={avatar}
              alt=""
            />
            <div className="flex flex-col gap-2 mt-3 items-center justify-center w-full">
              <input
                className=" ms-32 p-2 rounded-md"
                type="file"
                accept="image/*"
                onChange={imageOnChangeHandler}
              />
              <h1 className="text-sm font-light mt-2">
                Update your profile here
              </h1>
              <button
                onClick={ImageUpload}
                className="bg-text p-2 rounded-sm text-white hover:bg-bg-button hover:text-black w-1/2"
                type="button"
              >
                Upload
              </button>
            </div>
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

          {/* info */}
          <div className="h-4/5 w-full flex flex-col gap-2">
            {/* intro */}
            <div className="bg-card rounded-md h-14 flex justify-center">
              <p className="flex items-center">Manage Your Profile</p>
            </div>

            {/* info */}
            <div className="bg-card w-full rounded-md h-full">
              <div className="flex flex-row gap-10 w-full m-2 p-4">
                <div className="flex flex-col w-full">
                  <div className="flex flex-col mt-10">
                    <label className="font-bold text-lg text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      className="mt-3 text-sm font-semibold text-gray-600 focus:outline-none border-b-2 border-b-gray-500 bg-card"
                    />
                    {errors.name && (
                      <span className="text-[13px]  text-red-800">
                        {errors.name.message as string}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col mt-16">
                    <label className="font-bold text-lg text-gray-700">
                      Role
                    </label>
                    <input
                      type="text"
                      value={UserData?.role}
                      disabled
                      className="mt-3 text-sm font-semibold text-gray-600 focus:outline-none border-b-2 border-b-gray-500 bg-card"
                    />
                  </div>
                  <div className="flex flex-col mt-16">
                    <label className="font-bold text-lg text-gray-700">
                      Department
                    </label>
                    <input
                      type=""
                      value={departmentName}
                      disabled
                      className="mt-3 text-sm font-semibold text-gray-600 focus:outline-none border-b-2 border-b-gray-500 bg-card"
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="flex flex-col mt-10">
                    <label className="font-bold text-lg text-gray-700">
                      Email
                    </label>
                    <input
                      type="text"
                      {...register("email")}
                      disabled
                      className="mt-3 text-sm font-semibold text-gray-600 focus:outline-none border-b-2 border-b-gray-500 bg-card"
                    />
                    {errors.email && (
                      <span className="text-[13px] text-red-800">
                        {errors.email.message as string}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col mt-16">
                    <label className="font-bold text-lg text-gray-700">
                      phone
                    </label>
                    <input
                      type="text"
                      placeholder="09-xxxxxxxx"
                      {...register("phone")}
                      className="mt-3 text-sm font-semibold text-gray-600 focus:outline-none border-b-2 border-b-gray-500 bg-card"
                    />
                    {errors.phone && (
                      <span className="text-[13px] text-red-800">
                        {errors.phone.message as string}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col mt-16">
                    <label className="font-bold text-lg text-gray-700">
                      Unniversity/Ministry
                    </label>
                    <input
                      type="text"
                      {...register("university")}
                      className="mt-3 text-sm font-semibold text-gray-600 focus:outline-none border-b-2 border-b-gray-500 bg-card"
                    />
                    {errors.university && (
                      <span className="text-[13px] text-red-800">
                        {errors.university.message as string}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* button */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={isSame}
                  className="bg-text p-3 rounded-sm text-white hover:bg-bg-button hover:text-black m-4 w-1/2"
                >
                  Update
                </button>
              </div>
            </div>
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
        </div>
      </form>

      <ManagePassword />
    </div>
  );
};

export default Profile;
