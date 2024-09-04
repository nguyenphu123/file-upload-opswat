"use client";
import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile]: any = useState(null);
  const [fileName, setFileName] = useState("Choose File");

  const onFileChange = (e: any) => {
    
    console.log(e.target.files[0])
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    var headers = new Headers();
    var options = {
      method: "GET",
      headers: headers,
    };

    // const data = await res.json();

    const formData = new FormData();
    formData.append("file", file);
    try {
      var headers = new Headers();
      // headers.append("Accept ", "application/json");
      headers.append("Content-Type", "application/json");
      var options = {
        method: "PUT",
        headers: headers,
      };

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
