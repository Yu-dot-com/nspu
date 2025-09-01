import FileBar from "../components/fileBar";
import React, { useState } from "react";

const HiddenFile = () => {

  return (
    <div>
      <div>
        <button  className="font-semibold mt-4 text-3xl text-gray-900 flex items-center">
          Hidden File
        </button>
      </div>
      <FileBar isHidden={true}/>
    </div>
  );
};

export default HiddenFile;
