// SkeletonItem.tsx
import React from "react";

const SkeletonItem = () => {
  return (
    <div className="flex flex-row m-2 border-b-2 border-gray-300 p-2 justify-between animate-pulse">
      <div>
        {/* File icon + name */}
        <div className="flex flex-row items-center gap-2">
          <div className="h-5 w-5 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-4 w-6 bg-gray-300 rounded"></div>
        </div>
        {/* File size */}
        <div className="ms-6 mt-2">
          <div className="h-3 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {/* Due date + menu */}
        <div className="flex flex-row gap-3">
          <div className="h-3 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
        </div>
        {/* Action buttons */}
        <div className="flex flex-row gap-5">
          <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonItem;
