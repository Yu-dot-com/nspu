import { useUser } from "../hooks/useUser";
import supabase from "../database/supabase_client";
import { useCategory } from "../hooks/useCategory";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { useAllUser } from "../hooks/useAllUser";
import { useDepartment } from "../hooks/useDepartment";
import { AiOutlineUserDelete } from "react-icons/ai";
import supabaseAdmin from "../database/supabase_admin";
import CustomAlert from "../components/CustomAlert";

const ManageUser = () => {
  const [showAlert,setShowAlert]=useState(false);
  const [message,setMessage]=useState("");
  const {
    data: UserData,
    error: UserError,
    isLoading: UserLoading,
    refetch: UserRefetch,
  } = useAllUser();
  const {
    data: Ddata,
    error: Derror,
    isLoading: Dloading,
    refetch: DepartRefresh,
  } = useDepartment();
  const { data: ownData, isLoading: ownLoading } = useUser();
  const [depart, setDepart] = useState("");
  const [role, setRole] = useState("");

  if (UserLoading)
    return (
      <p className="text-white flex justify-center items-center">
        Loading Users...
      </p>
    );
  if (UserError) return <p className="text-red-500">Failed to load files</p>;

  const handleDepartment = async (id: any, depart: any) => {
    console.log(id, depart);
    const { error } = await supabase
      .from("users")
      .update({ department_id: depart })
      .eq("id", id);
    if (error) {
      alert("Failed to update role: " + error.message);
    } else {
      setMessage('User Department Updated');
      setShowAlert(true);
 
    }
  };

  const handleRole = async (id: any, role: any) => {
    console.log(role, id);
    const { error } = await supabase
      .from("users")
      .update({ role: role })
      .eq("id", id);
    if (error) {
      setMessage("Failed to update department");
      setShowAlert(true);
      console.log("Failed to update department: " + error.message);
    } else {
      setMessage('User role updated');
      setShowAlert(true);
     
    }
  };

  const handleDelete = async (id: any) => {
    console.log(id);
    const confirm = window.confirm("Are you sure to delete?");
    if (!confirm) {
      return;
    }

    const { error, data } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error("Error deleting user from Auth:", error);
      return;
    }

    const { error: tableError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", id);

    if (tableError) {
      console.error("Error deleting user from users table:", tableError);
      return;
    }
   
    setMessage("User deleted");
    setShowAlert(true);
  };

  return (
    <div>
      <div>
        <h1 className="font-medium text-lg">Manage User</h1>
        <h1 className="text-sm font-light mt-2">
          You can manage user like changing roles and departments
        </h1>
        <hr className="text-gray-800 border-gray-700 bg-gray-700 mt-2" />
      </div>
      <div className="">
        {/* userList */}
        <div className="w-full">
          <h1 className="font-medium text-md mt-3 mb-4">User Lists</h1>
          {Array.isArray(UserData) &&
            UserData.map((n) => (
              <div
                key={n.id}
                className="flex flex-col w-full mb-3 cursor-pointer hover:bg-card hover:shadow-lg border border-gray-600 rounded-lg p-3 "
              >
                <div className="flex flex-row justify-between relative w-full">
                  <p className="text-sm flex items-center">
                    {n.name}{" "}
                    {ownData.id === n.id && (
                      <span className="text-gray-700 ms-3">( You )</span>
                    )}
                  </p>
                  <div className="flex flex-row gap-5">
                    <select
                      onChange={(e) => handleRole(n.id, e.target.value)}
                      value={n.role || ""}
                      className="w-full border rounded p-1 text-sm font-light birder-black bg-card hover:bg-bg-color text-gray-600 focus:"
                    >
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>

                    <select
                      onChange={(e) => handleDepartment(n.id, e.target.value)}
                      value={n.department_id}
                      className="w-full me-10 border rounded p-2 text-sm font-light text-gray-500 focus:"
                    >
                      <option value=""></option>
                      {Dloading ? (
                        <option>Loading</option>
                      ) : (
                        Ddata.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.name}
                          </option>
                        ))
                      )}
                    </select>

                    <AiOutlineUserDelete
                      onClick={() => handleDelete(n.id)}
                      className="text-2xl flex items-center mt-1 right-1 absolute"
                    />
                  </div>
                  
                </div>
                    {showAlert && (
                                  <CustomAlert
                                    message={message}
                                    onClose={() => {
                                               UserRefetch();
                                      setShowAlert(false);
                                      
                                      setMessage("");
                              
                                    }}
                                  />
                                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
