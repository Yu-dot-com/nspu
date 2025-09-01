import React, { useState } from "react";

type File = {
  title: string;
  category: string;
  due: string;
};

const data: File[] = [
  { title: "Scholarship Announcement", category: "Civil", due: "2025-05-10" },
  { title: "Faculty Meeting", category: "Sports", due: "2025-05-05" },
  { title: "IT Department Report", category: "IT", due: "2025-05-03" },
  { title: "Seminar Registration", category: "Civil", due: "2025-04-30" },
];

const selectFile = async () => {
  const filePath = await window.electron.invoke('open-file-dialog');
  console.log("Selected file:", filePath);
};


const categoryColors: Record<string, string> = {
  Civil: "bg-orange-400",
  Sports: "bg-cyan-500",
  IT: "bg-indigo-600",
};

const categories = ["All", "Civil", "IT", "Sports"];

export default function App() {
  const [files, setFiles] = useState<File[]>(data);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isAdding, setIsAdding] = useState(false);

  // Form state for new file
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Civil");
  const [newDue, setNewDue] = useState("");

  // Filter files by selected category
  const filteredFiles =
    selectedCategory === "All"
      ? files
      : files.filter((file) => file.category === selectedCategory);

  const handleAddFile = () => {
    if (!newTitle.trim() || !newDue.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const newFile: File = {
      title: newTitle.trim(),
      category: newCategory,
      due: newDue,
    };

    setFiles((prev) => [...prev, newFile]);

    // Reset form and close modal
    setNewTitle("");
    setNewDue("");
    setNewCategory("Civil");
    setIsAdding(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat}
              className={`cursor-pointer hover:underline ${
                selectedCategory === cat ? "font-bold underline" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Faculty File Manager</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => setIsAdding(true)}
          >
            Add File
          </button>
        </div>

        {/* File Cards */}
        <div className="space-y-4">
          {filteredFiles.length === 0 && (
            <p className="text-gray-500">No files found for this category.</p>
          )}
          {filteredFiles.map((file, i) => (
            <div
              key={i}
              className="border rounded-md p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-medium">{file.title}</h2>
                <span
                  className={`inline-block text-white text-sm px-2 py-0.5 rounded mt-1 ${
                    categoryColors[file.category] || "bg-gray-400"
                  }`}
                >
                  {file.category}
                </span>
              </div>
              <span className="text-red-600 text-sm">Due {file.due}</span>
            </div>
          ))}
        </div>

        {/* Add File Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-80">
              <h2 className="text-xl font-semibold mb-4">Add New File</h2>
            <button onClick={selectFile}>
  Select File from Computer
</button>
              <label className="block mb-2">
                Title:
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="border p-1 w-full mt-1 rounded"
                  autoFocus
                />
              </label>

              <label className="block mb-2">
                Category:
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border p-1 w-full mt-1 rounded"
                >
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </label>

              <label className="block mb-4">
                Due Date:
                <input
                  type="date"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  className="border p-1 w-full mt-1 rounded"
                />
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleAddFile}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
