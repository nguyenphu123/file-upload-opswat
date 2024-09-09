"use client";
import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile]: any = useState(null);
  const [fileName, setFileName] = useState("Choose File");
  const [policyName, setPolicyName] = useState("");
  const onFileChange = (e: any) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (file == null) {
      alert("No file found");
      return;
    }
    if (policyName == "") {
      alert("Please enter your workflow name");
      return;
    }
    try {
      var headers = new Headers();
      // headers.append("Accept ", "application/json");
      headers.append("Content-Type", "application/json");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("workflowName", policyName);
      const data = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
      alert("File uploaded successfully");
    } catch (err) {
      alert("File upload failed");
      console.log(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="custom-file mb-4">
        <input
          type="text"
          placeholder="workflow name"
          onChange={(e) => setPolicyName(e.target.value)}
        />
      </div>
      <div className="custom-file mb-4">
        <input
          type="file"
          className="custom-file-input"
          id="customFile"
          onChange={(e) => onFileChange(e)}
        />
        <label className="custom-file-label" htmlFor="customFile">
          {fileName}
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Upload
      </button>
    </form>
  );
};

export default FileUpload;
