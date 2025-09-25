import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createNote, updateNoteById } from "../services/operations/notesAPI";
import { toast } from "react-hot-toast";
import { setLoading } from "../slices/notesSlice";

const CreateNoteModal = ({ onClose, note }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

   // Prefill inputs if editing
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

   const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Both Title and Content are required");
      return;
    }

    dispatch(setLoading(true));
    const toastId = toast.loading(note ? "Updating note..." : "Saving note...");

    try {
      if (note) {
        // Edit existing note
        await dispatch(updateNoteById(note._id, { title, content }));
        toast.success("Note updated successfully!");
      } else {
        // Create new note
        await dispatch(createNote({ title, content }));
        toast.success("Note created successfully!");
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save note");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4 sm:px-6 overflow-y-auto">
      <div className="relative w-full max-w-md sm:max-w-lg bg-black/80 backdrop-blur-md text-white p-4 sm:p-6 rounded-xl shadow-lg my-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">{note ? "Edit Note" : "Create New Note"}</h2>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 sm:p-3 rounded-lg bg-white/10 placeholder-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Content Textarea */}
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full mb-4 p-2 sm:p-3 rounded-lg bg-white/10 placeholder-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 w-full sm:w-auto rounded-lg bg-gray-600 hover:bg-gray-500 transition text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 w-full sm:w-auto rounded-lg bg-blue-600 hover:bg-blue-500 transition text-sm sm:text-base disabled:opacity-50"
          >
           {note ? "Edit" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNoteModal;

