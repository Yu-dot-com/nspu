import { useOnlyFile } from "../hooks/useOnlyFIle";
import supabase from "../database/supabase_client";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { useOnlyCategory } from "../hooks/useOnlyCategory";
import { useOnlyDepartment } from "../hooks/useOnlyDepartment";
import FileEdit from "../components/fileEdit";
import { useUser } from "../hooks/useUser";

type FileData = {
  id: string;
  name: string;
  path: string;
  size: number;
  duedate: string;
  status: boolean;
  important: boolean;
  filetype: string;
  visible: boolean;
  category_id: string;
  sender: string;
  receiver: string;
  department_ids: any;
  inboxoroutbox: "inbox" | "outbox";
  created_at: string;
};
 const imageTypes=["png","jpg","jpeg","gif","webp"];

const Detail = () => {
  const { id } = useParams();
  const {
    data: fileData,
    refetch,
    error: fileError,
    isLoading,
  } = useOnlyFile(id);
  const [open, setOpen] = useState(false);
  const { data: categoryData, error: categoryError } = useOnlyCategory(
    fileData?.category_id
  );
  const { data: departmentData, error: departmentError } = useOnlyDepartment([
    fileData?.department_ids,
  ]);
  const navigate = useNavigate();
  const {data: CurrentUser} = useUser()

  if (departmentError)
    return (
      <p className="text-center mt-10 text-red-500">
        {(departmentError as Error).message}
      </p>
    );
  if (categoryError)
    return (
      <p className="text-center mt-10 text-red-500">
        {(categoryError as Error).message}
      </p>
    );
  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (fileError)
    return (
      <p className="text-center mt-10 text-red-500">
        {(fileError as Error).message}
      </p>
    );
  if (!fileData) return <p className="text-center mt-10">File not found</p>;

  const { data } = supabase.storage
    .from("userfile")
    .getPublicUrl(fileData.path);
  const publicUrl = data?.publicUrl || "";
  console.log(publicUrl)

  return (
    <div className="">
      <div className="mt-7 flex flex-row gap-3 justify-between">
        <IoArrowBackSharp
          onClick={() => navigate(-1)}
          className="text-2xl cursor-pointer font-light"
        />
        <p className="font-bold ms-2">{fileData.name.split(".")[0]}</p>
        {
          CurrentUser?.role==="admin" && (
            <FaEdit
          onClick={() => setOpen(true)}
          className=" cursor-pointer text-2xl font-light"
        />
          )
        }
      </div>
      <div className="w-full min-h-screen mb-5 mx-auto -mt-2 bg-bg-button">
        {/* nav */}
        <div className="mt-5 flex w-full  h-full mb-2  flex-row justify-end">
          <span className="me-5 text-sm font-light">
            Uploaded at :{fileData.created_at.split("T")[0]}
          </span>
        </div>
        {/* metaData */}
        <div>
          <div className="flex flex-row justify-between border -mt-1 border-orange-100 m-4 p-5">
            <div>
              <p className="text-sm">
                <strong>Name:</strong> {fileData.name}
              </p>
              <p className="text-sm">
                <strong>Size:</strong>{" "}
                {(fileData.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <p className="text-sm">
                <strong>Due date:</strong>{" "}
                {fileData.duedate?.split("T")[0] || "None"}
              </p>
              <p className="text-sm">
                <strong>Category:</strong> {categoryData?.name}
              </p>
              <p className="text-sm">
                <strong>Department:</strong>{" "}
                {departmentData
                  ?.map((dep: { name: string }) => dep.name)
                  .join(",") || "None"}
              </p>
            </div>
            <div>
              <p className="text-sm">
                <strong>Sender:</strong>{" "}
                {fileData.sender === "" ? "None" : fileData.sender}
              </p>
              <p className="text-sm">
                <strong>Receiver:</strong>{" "}
                {fileData.receiver === "" ? "None" : fileData.receiver}
              </p>
              <p className="text-sm">
                <strong>Type:</strong> {fileData.inboxoroutbox}
              </p>
            </div>
          </div>
        </div>
        {/* preview */}
        {/* preview */}
        <div className="flex justify-center items-center mt-10  w-full h-[80vh] border-orange-100 rounded-lg p-4">
          {imageTypes.includes(fileData.filetype) ? (
            // Images
            <img
              src={publicUrl}
              alt={fileData.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            // Other files: show download button
            <div className="flex flex-col items-center">
              <p className="mb-4">Preview not available for this file type</p>
              <a
                href={
                  publicUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Download {fileData.name}
              </a>
            </div>
          )}
        </div>
      </div>
      {/* editbox */}
      {open && !isLoading && (
        <FileEdit
          fileId={fileData.id}
          file={fileData}
          onClose={async () => (await refetch(), setOpen(false))}
        />
      )}
    </div>
  );
};

export default Detail;
