import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileBar from "../components/fileBar";
import { useFile } from "../hooks/useFile";
import { useDepartment } from "../hooks/useDepartment";
import { useCategory } from "../hooks/useCategory";

const CategoryBar = () => {
  const [filter, setFilter] = useState("all");
  const { data, error, isLoading } = useCategory();
  if (isLoading)
    return (
      <p className="text-white flex justify-center items-center">
        Loading files...
      </p>
    );
  if (error) return <p className="text-red-500">Failed to load files</p>;

  return (
    <div className="w-full overflow-x-auto mt-7">
      <div className="flex flex-row min-w-max">
        <button onClick={()=>setFilter("all")} className="bg-text px-5 p-2 mt-1 text-white hover:bg-bg-button hover:text-black cursor-pointer first:rounded-l-xl last:rounded-r-xl
        border-l border-text rounded-l-xl">View All</button>
        {data.map((n, i) => (
          <button
            key={i}
            onClick={() => setFilter(n.id)}
            className={`bg-text text-white px-5 p-2 mt-1 hover:bg-bg-button hover:text-black cursor-pointer first:rounded-l-xl last:rounded-r-xl
        border-l border-text
        ${i === data.length - 1 ? "rounded-r-xl" : ""}`}
          >
            {n.name}
          </button>
        ))}
      </div>

      <FileBar filter={filter} />
    </div>
  );
};

export default CategoryBar;
