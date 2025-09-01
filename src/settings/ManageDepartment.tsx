import CustomAlert from "../components/CustomAlert";
import supabase from "../database/supabase_client";
import { useDepartment } from "../hooks/useDepartment";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";

type departmentProps = {
  id: string;
  name: string;
};

const ManageDepartment = () => {
  const {
    data: departmentData,
    error,
    isLoading: DepartmentLoading,
    refetch,
  } = useDepartment();
  const [editid, setEditid] = useState("");
  const [editmode, setEditmode] = useState(false);
  const [value, setValue] = useState("");
  const [message, Setmessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<departmentProps>();

  if (DepartmentLoading)
    return (
      <p className="text-white flex justify-center items-center">
        Loading files...
      </p>
    );
  if (error) return <p className="text-red-500">Failed to load files</p>;

  const onSubmit: SubmitHandler<departmentProps> = async (data) => {
    const trimName = data.name.trim().toLowerCase();

    const isDuplicate = departmentData.some(
      (de: any) => de.name.trim().toLowerCase() === trimName
    );

    if (isDuplicate) {
      Setmessage("Department already exist");
      setShowAlert(true);
      return;
    }

    if (editmode && editid) {
      const { error: UpdateError, data: updatedData } = await supabase
        .from("departments")
        .update({ name: data.name })
        .eq("id", editid)
        .select();
      console.log("Updating:", { id: editid, name: data.name });
      console.log("Updated Data:", updatedData);

      if (UpdateError) {
        Setmessage("Update failed");
        setShowAlert(true);
        setValue("");
        reset({ name: "" });
        return;
      }
      Setmessage("Department updated successfully");
      setShowAlert(true);
      setEditid("");
      setValue("");
      setEditmode(false);
      refetch();
      setValue("");
      reset({ name: "" });
      return;
    } else {
      try {
        const { error: insertError } = await supabase
          .from("departments")
          .insert([{ name: data.name }]);
        if (insertError) {
          Setmessage("Something went wrong");
          setShowAlert(true);
          return;
        }
      } catch (error) {
        Setmessage("Something went wrong");
        setShowAlert(true);
        return;
      }
      Setmessage("Department added successfully");
      setShowAlert(true);
      refetch();
      reset();
    }
  };

  const handleDelete = async (id: string) => {
    // const confirmDelete = window.confirm("Are you sure to delete");
    // if (!confirmDelete) {
    //   return;
    // }

    try {
      const { error: DeleteError } = await supabase
        .from("departments")
        .delete()
        .eq("id", id);
      if (DeleteError) {
        Setmessage("Can't delete this Department");
        setShowAlert(true);
        return;
      }
    } catch (error) {
      Setmessage("Something went wrong");
      setShowAlert(true);
      return;
    }
    Setmessage("Department deleted successfully");
    setShowAlert(true);
    refetch();
  };

  const handleEdit = async (id: string, name: string) => {
    setEditid(id);
    setEditmode(true);
    setValue(name);
    reset({ name });
  };

  return (
    <div>
      <div>
        <h1 className="font-medium text-lg">Manage Department</h1>
        <h1 className="text-sm font-light mt-2">
          You can manage the departments like inserting , deleting and updating
        </h1>
        <hr className="text-gray-800 border-gray-700 bg-gray-700 mt-2" />
      </div>
      <div className="flex flex-row justify-between gap-5">
        {/* categoryList */}
        <div className="w-full">
          <h1 className="font-medium text-md mt-3 mb-4">Department Lists</h1>
          {departmentData.map((n, i) => (
            <div
              key={i}
              className={`flex flex-col w-2/3 mb-3 border hover:bg-card hover:shadow-lg cursor-pointer border-gray-600 rounded-lg p-3 ${
                editid === n.id
                  ? "bg-text hover:bg-bg-button border-blue-200 shadow-md"
                  : "hover:bg-bg-button hover:text-black hover:shadow-lg"
              }`}
            >
              <div className="flex flex-row justify-between">
                <p className="text-sm">{n.name}</p>
                <div className="flex flex-row gap-2">
                  <AiOutlineDelete
                    onClick={() => handleDelete(n.id)}
                    className="cursor-pointer"
                  />
                  <BiSolidEdit onClick={() => handleEdit(n.id, n.name)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* addCategory */}
        <div className="w-full">
          <h1 className="font-medium text-md mt-3 mb-4">Add New Department</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border horver:bg-gray-700 hover:shadow-lg border-gray-600 h-40 p-3 justify-between rounded-lg flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                <label className="ms-2">Enter Department Name</label>
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
                  className="border border-black rounded-xl focus:outline-1 focus:outline-dashed focus:outline-black p-1 px-5 bg-card"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  disabled={isLoading}
                  className="bg-card border border-black text-center cursor-pointer px-8 rounded-xl hover:bg-bg-button hover:text-black"
                >
                  {editmode ? "Update" : "Add"}
                </button>
                {editmode && (
                  <button
                    disabled={isLoading}
                    onClick={() => {
                      setEditid("");
                      setValue("");
                      setEditmode(false);
                      reset();
                    }}
                    className="bg-card border border-black text-center cursor-pointer px-8 rounded-xl hover:bg-bg-button hover:text-black"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
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
  );
};

export default ManageDepartment;
