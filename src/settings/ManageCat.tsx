import CustomAlert from "../components/CustomAlert";
import supabase from "../database/supabase_client";
import { useCategory } from "../hooks/useCategory";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";

type categoryProps = {
  id?: string;
  name?: string;
};

const ManageCat = () => {
  const {
    data: CategoryData,
    error,
    isLoading: CategoryLoading,
    refetch,
  } = useCategory();
  const [category, setCategory] = useState("");
  const [editid, setEditid] = useState("");
  const [editmode, setEditmode] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [message, Setmessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isLoading },
    reset,
  } = useForm<categoryProps>();

  if (CategoryLoading)
    return (
      <p className="text-white flex justify-center items-center">
        Loading files...
      </p>
    );
  if (error) return <p className="text-red-500">Failed to load files</p>;

  //   submitCatefory
  const onSubmit: SubmitHandler<categoryProps> = async (data) => {
    const trimName = data.name.trim().toLowerCase();
    const isDuplicate = CategoryData.some(
      (cat: any) => cat.name.trim().toLowerCase() === trimName
    );

    if (isDuplicate) {
      Setmessage("Category already exist");
      setShowAlert(true);
      return;
    }

    try {
      if (editid && editmode) {
        const old = CategoryData.find((cat) => cat.id === editid);
        if (old?.name.trim().toLowerCase() === value.trim().toLowerCase()) {
          Setmessage("No chage detected");
          setShowAlert(true);
          return;
          setValue("");
          reset({ name: "" });
        }
        const { error: UpdateError, data: UpdatedData } = await supabase
          .from("categories")
          .update({ name: data.name })
          .eq("id", editid)
          .select();

        if (UpdateError) {
          Setmessage("Update Failed");
          setShowAlert(true);
          setValue("");
          reset({ name: "" });
          return;
        }
        Setmessage("Updated Successfully");
        setShowAlert(true);
        setEditid("");
        setValue("");
        setEditmode(false);
        refetch();
        setValue("");
        reset({ name: "" });
        return;
      }

      const { error: SubmitError } = await supabase
        .from("categories")
        .insert([{ name: data.name }]);
      if (SubmitError) {
        Setmessage("Failed to add Category");
        setShowAlert(true);
        return;
      }
      Setmessage("Category added successfully");
      setShowAlert(true);
      reset();
    } catch (error) {
      Setmessage("Something went wrong");
      setShowAlert(true);
      return;
    }
    refetch();
  };

  //   deleteCategory
  const handleDelete = async (id: string) => {
    console.log(id);
    // const confirmDelete = window.confirm("Are you sure to delete");
    // if (!confirmDelete) {
    //   return;
    // }

    try {
      const { error: DeleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      if (DeleteError) {
        alert("Failed to Delete");
        return;
      }
    } catch (error) {
      Setmessage("Something went wrong");
      setShowAlert(true);
      return;
    }
    Setmessage("Category deleted successfully");
      setShowAlert(true);
    refetch();
  };

  const handleEdit = async (id: string, name: string) => {
    setEditmode(true);
    setEditid(id);
    setValue(name);
    reset({ name });
  };

  return (
    <div>
      <div>
        <h1 className="font-medium text-lg">Manage Category</h1>
        <h1 className="text-sm font-light mt-2">
          You can manage the categories like inserting , deleting and updating
        </h1>
        <hr className="text-gray-800 border-gray-700 bg-bg mt-2" />
      </div>
      <div className="flex flex-row justify-between gap-5">
        {/* categoryList */}
        <div className="w-full">
          <h1 className="font-medium text-md mt-3 mb-4">Category List</h1>
          {CategoryData.map((n) => (
            <div
              key={n.id}
              className={`flex flex-col w-2/3 mb-3 cursor-pointer hover:bg-card hover:shadow-lg border border-gray-600 rounded-lg p-3 ${
                editid === n.id
                  ? "bg-text hover:bg-bg-button border-blue-200 shadow-md"
                  : " hover:bg-bg-button hover:text-black hover:shadow-lg"
              }`}
            >
              <div className="flex flex-row justify-between">
                <p className="text-sm">{n.name}</p>
                <div className="flex flex-row gap-2">
                  <AiOutlineDelete
                    className="cursor-pointer"
                    onClick={() => handleDelete(n.id)}
                  />
                  <BiSolidEdit onClick={() => handleEdit(n.id, n.name)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* addCategory */}
        <div className="w-full">
          <h1 className="font-medium text-md mt-3 mb-4">Add New Category</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border border-gray-600 hover:bg-card hover:shadow-lg h-40 p-3 justify-between rounded-lg flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                <label className="ms-2">Enter Category Name</label>
                <input
                  type="text"
                  {...register("name", {
                    required: true,
                    validate: (v) => v.trim() !== "",
                  })}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                  className="border border-black rounded-xl focus:outline-1 focus:outline-dashed focus:outline-black p-1 px-5 bg-card "
                />
              </div>

              <div className="flex justify-end">
                <button
                  disabled={isLoading || CategoryLoading}
                  className="bg-card border-black border  text-center cursor-pointer px-8 rounded-xl hover:text-white"
                >
                  {editmode ? "Update" : "Add"}
                </button>
                {editmode && (
                  <button
                    type="button"
                    className="bg-card border-black border ms-3  text-center cursor-pointer px-8 rounded-xl hover:text-white"
                    onClick={() => {
                      setEditmode(false);
                      setEditid("");
                      setValue("");
                      reset();
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
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
  );
};

export default ManageCat;
