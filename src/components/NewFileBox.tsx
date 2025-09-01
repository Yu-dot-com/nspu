import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineFileUpload } from "react-icons/md";
import { newFileSchema } from "../schema/inputSchema";
import { newFile } from "../schema/inputSchema";
import { useBox } from "../utils/FileContext";
import supabase from "../database/supabase_client";
import mime from "mime";
import { useFile } from "../hooks/useFile";
import { useCategory } from "../hooks/useCategory";
import { useDepartment } from "../hooks/useDepartment";
import CustomAlert from "./CustomAlert";

type FileRow = {
  id: string;
  name: string;
  path: string;
  filetype: string;
  category_id: string;
  department_ids: string[];
  duedate: string | null;
  sender: string;
  receiver: string;
  visible: boolean;
  important: boolean;
  inboxoroutbox: string;
  size: number | null;
};

// Type for insertion (omit id)
type InsertFileRow = Omit<FileRow, "id">;

const NewFileBox = () => {
  const { isOpen, setOpen } = useBox();
  const [filePath, setFilePath] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [filetype, setfiletype] = useState<string>("");
  const [fileBuffer, setFileBuffer] = useState<Uint8Array | null>(null);
  const [inboxoroutbox, setinboxoroutbox] = useState("");
  const [size, setsize] = useState<number | null>(null);
  const { refetch } = useFile();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    data: Cdata,
    error: Cerror,
    isLoading: CategoryLoading,
  } = useCategory();
  const { data: Ddata, error: Derror, isLoading: Dloading } = useDepartment();
  const [message, Setmessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isLoading },
  } = useForm<newFile>({
    resolver: zodResolver(newFileSchema),
  });
  const selectedDepartments: string[] = (watch("department_ids") ||
    []) as string[];

  if (Dloading)
    return (
      <p className="text-white flex justify-center items-center">
        Loading files...
      </p>
    );
  if (Derror) return <p className="text-red-500">Failed to load files</p>;
  if (CategoryLoading)
    return (
      <p className="text-white flex justify-center items-center">
        Loading files...
      </p>
    );
  if (Derror) return <p className="text-red-500">Failed to load files</p>;

  const onSubmit: SubmitHandler<newFile> = async (data) => {
    setIsUploading(true);

    try {
      const format = (str: string) =>
        str
          .trim()
          .replace(/[\s\u200B-\u200D\uFEFF]/g, "_")
          .replace(/[^a-zA-Z0-9_\-\.\/]/g, "");

      console.log(data.category_id);

      const department_name = Ddata.find(
        (d) => d.id === data.department_ids
      )?.name;

      const categoryName = Cdata.find((c) => c.id === data.category_id)?.name;

      if (!fileBuffer) {
        alert("Please choose a file first");
      }
      const filepath = data.name;
      const filename = filepath.split("/").pop();
      const uniquefilename = `${categoryName}/${Date.now()}_${filename}`;
      const realfilename = format(uniquefilename);
      const mimeType = mime.getType(filename) || "application/octet-stream";
      const fileBlob = new Blob([fileBuffer]);
      const dueDateValue = data.duedate === "" ? null : data.duedate;

      const { data: UploadData, error: UploadError } = await supabase.storage
        .from("userfile")
        .upload(realfilename, fileBlob, { upsert: true });

      if (UploadError) {
        Setmessage("File Upload Failed");
        setShowAlert(true);
        setOpen(true);
        return;
      }

      const { error: insertError, data: insertData } = await supabase
        .from("files")
        .insert<InsertFileRow>([
          {
            name: data.name,
            path: uniquefilename,
            filetype: data.filetype,
            category_id: data.category_id,
            department_ids: data.department_ids,
            duedate: dueDateValue,
            sender: data.sender,
            receiver: data.receiver,
            visible: data.visible,
            important: data.important,
            inboxoroutbox: data.inboxoroutbox,
            size: size,
          },
        ])
        .select()
        .single();

      if (insertError || !insertData) {
        Setmessage("Something went wrong ");
        setShowAlert(true);
        return;
      }

      if (insertData.department_ids === null) {
        Setmessage("File Uploaded Successfully ");
        setShowAlert(true);
        console.log("electronAPI:", window.electronAPI);
        if (window.electronAPI?.notify) {
          window.electronAPI.notify({
            title: "School added New File",
            body: `A new file "${insertData.name}" has been uploaded to School.`,
          });
        } else {
          console.warn("electronAPI.notify is not available!");
        }
      } else {
        const { data: deptUser, error: deptError } = await supabase
          .from("users")
          .select("id")
          .in("department_id", data?.department_ids);
        if (deptError) {
          Setmessage("Something went wrong ");
          setShowAlert(true);
        }

        const notifications = deptUser.map((u) => ({
          file_id: insertData.id,
          user_id: u.id,
          new_file: true,
          is_read: false,
          one_day: false,
          two_day: false,
          three_day: false,
          four_day: false,
          five_day: false,
        }));

        const { error: notiError } = await supabase
          .from("notifications")
          .insert(notifications);

        if (notiError) alert(notiError);

        Setmessage("File Uploaded Successfully ");
        setShowAlert(true);
        deptUser.forEach((u) => {
          console.log("electronAPI:", window.electronAPI);
          if (window.electronAPI?.notify) {
            window.electronAPI.notify({
              title: "New File Uploaded",
              body: `A new file "${insertData.name}" has been uploaded for your department.`,
            });
          } else {
            console.warn("electronAPI.notify is not available!");
          }
        });
      }

      refetch();
    } catch (err) {
      console.error(err);
      Setmessage("Unexpected error occurred");
      setShowAlert(true);
    } finally {
      setIsUploading(false);
    }
  };

  const chooseFile = async () => {
    const path = await window.electronAPI.openFileDialog();
    if (path?.[0]) {
      const fullPath = path[0];
      setFilePath(path[0]);

      const name = path[0].split(/[/\\]/).pop() || "";
      const extension = fullPath.split(".").pop()?.toLowerCase() || "";
      setFilename(name);
      setfiletype(extension);

      const fileBytes: Uint8Array = await window.electronAPI.readFile(fullPath);
      const size = fileBytes.length;

      setsize(size);
      setFileBuffer(fileBytes);

      setValue("size", size);
      setValue("path", path[0]);
      setValue("filetype", extension);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center inset-0 fixed bg-opacity-15 bg-black z-50">
      <div className="bg-card flex flex-col justify-between w-1/2 h-[700px] p-6 rounded-lg ">
        <div className="flex flex-row justify-between">
          <p>Upload File Data</p>
          <select
            {...register("inboxoroutbox")}
            className="border rounded p-2 text-sm font-light text-black bg-bg-color focus:"
          >
            <option value="inbox">Inbox</option>
            <option value="outbox">Outbox</option>
            <option value="school">School</option>
          </select>
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="border-4 border-t-blue-500 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-between h-full"
        >
          {/* choose file */}
          <div
            onClick={chooseFile}
            className="w-full bg-bg-button flex items-center flex-col gap-2 rounded-lg p-3 justify-center mt-5 cursor-pointer"
          >
            <input
              type="hidden"
              defaultValue={filetype}
              {...register("path")}
            />
            <input type="hidden" {...register("filetype")} />
            <MdOutlineFileUpload className="text-3xl font-light" />
            <span className="text-sm">Upload an Image or file </span>
          </div>
          {errors.path && (
            <span className="text-sm text-red-700">
              {errors.path.message as string}
            </span>
          )}

          {/* filename */}
          <div className="mt-3 flex flex-col gap-1">
            <p className="text-sm font-semibold">File Name</p>
            <input
              {...register("name")}
              type="text"
              className="w-full bg-bg-color px-3 text-black placeholder:text-black rounded-lg p-1 placeholder:font-light placeholder:text-sm "
              placeholder="Choose File"
              defaultValue={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            {errors.name && (
              <span className="text-sm text-red-700">
                {errors.name.message as string}
              </span>
            )}
          </div>

          {/* category/department */}
          <div className="mt-3 flex flex-row gap-1">
            {/* category */}
            <div className="w-full flex flex-col gap-1">
              {" "}
              <p className="text-sm font-semibold">Category</p>{" "}
              <div>
                {" "}
                <select
                  {...register("category_id")}
                  className="w-full border rounded p-2 text-sm font-light text-black bg-bg-color focus:"
                >
                  {" "}
                  <option value="" className="font-light text-black text-sm">
                    {" "}
                    Select Category{" "}
                  </option>{" "}
                  {Cdata.map((n) => (
                    <option key={n.id} value={n.id}>
                      {" "}
                      {n.name}{" "}
                    </option>
                  ))}{" "}
                </select>{" "}
              </div>{" "}
              {errors.category_id && (
                <span className="text-sm text-red-700">
                  {" "}
                  {errors.category_id.message as string}{" "}
                </span>
              )}{" "}
            </div>

            {/* department */}
            <div className="w-full flex flex-col gap-1 relative">
              <p className="text-sm font-semibold">Department</p>
              <div>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="w-full border rounded p-2 text-sm font-light text-black bg-bg-color flex justify-between items-center focus:outline-none"
                >
                  <span>
                    {selectedDepartments.length > 0
                      ? selectedDepartments
                          .map((id) => Ddata.find((d) => d.id === id)?.name)
                          .join(", ")
                      : "ALL Departments"}
                  </span>
                  <span className="ml-2">&#9662;</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {Ddata.map((dept) => (
                      <div
                        key={dept.id}
                        className={`text-sm font-light text-black bg-bg-color px-3 py-2 cursor-pointer hover:bg-indigo-100 ${
                          selectedDepartments.includes(dept.id)
                            ? "bg-indigo-200"
                            : ""
                        }`}
                        onClick={() => {
                          const current = selectedDepartments;
                          if (current.includes(dept.id)) {
                            setValue(
                              "department_ids",
                              current.filter((id) => id !== dept.id)
                            );
                          } else {
                            setValue("department_ids", [...current, dept.id]);
                          }
                        }}
                      >
                        {dept.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.department_ids && (
                <span className="text-sm text-red-700">
                  {errors.department_ids.message as string}
                </span>
              )}
            </div>
          </div>

          {/* datepicker */}
          <div className="mt-3 flex flex-col gap-1">
            <p className="text-sm font-semibold">Due Date</p>
            <input
              type="datetime-local"
              {...register("duedate")}
              className="w-full h-8 text-sm font-light border border-bg-color text-black bg-bg-color rounded px-3"
            />
            {errors.duedate && (
              <span className="text-sm text-red-700">
                {errors.duedate.message as string}
              </span>
            )}
          </div>

          {/* sender/receiver */}
          <div className="mt-3 flex flex-row gap-1">
            {/* sender */}
            <div className="w-full flex flex-col gap-1">
              <p className="text-sm font-semibold">Sender</p>
              <input
                type="text"
                {...register("sender")}
                className="p-1 border rounded-lg bg-bg-color text black "
              />
              {errors.sender && (
                <span className="text-sm text-red-700">
                  {errors.sender.message as string}
                </span>
              )}
            </div>
            {/* receiver */}
            <div className="w-full flex flex-col gap-1">
              <p className="text-sm font-semibold">Receiver</p>
              <input
                {...register("receiver")}
                type="text"
                className="p-1 border rounded-lg bg-bg-color text-black"
              />
              {errors.receiver && (
                <span className="text-sm text-red-700">
                  {errors.receiver.message as string}
                </span>
              )}
            </div>
          </div>

          {/* show/importtant */}
          <div className="mt-5 flex flex-row justify-between">
            {/* show */}
            <div className="flex flex-row gap-3">
              <p className="text-sm font-semibold">Show File to Others</p>
              <input
                {...register("visible")}
                type="checkbox"
                defaultChecked
                className="scale-150 accent-blue-500 cursor-pointer"
              />
            </div>
            {/* importtant */}
            <div className="flex flex-row gap-3">
              <p className="text-sm font-semibold">Mark as Important</p>
              <input
                type="checkbox"
                {...register("important")}
                className="scale-150 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* footer */}
          <div className="flex mt-3 justify-end gap-2 flex-row pt-4">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
              }}
              className="bg-bg-color px-6 py-2 text-black hover:bg-bg-button hover:text-white rounded hover:"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-text  px-6 py-2 text-white rounded hover:text-black hover:bg-bg-button"
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
                setOpen(false);
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default NewFileBox;
