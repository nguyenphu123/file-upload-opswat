"use client";
import React, { useState, useEffect } from "react";

const FileUpload = () => {
  const [file, setFile]: any = useState(null);
  const [fileName, setFileName] = useState("Choose File");
  const [policyName, setPolicyName] = useState("");
  const [apikey, setApikey] = useState("");
  const [analysisID, setAnalysisID] = useState("");
  const [uploadingToOpswat, setUploadingToOpswat] = useState(false);
  const [uploadingToS3, setUploadingToS3] = useState(false);
  const [scannedFile, setScannedFile]: any = useState(null);
  const [time, setTime] = useState(1000);
  const [mode, setMode] = useState("sync");
  const interval = setInterval(() => getStatus(), time);

  const onFileChange = (e: any) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const fetchToken = async () => {
    let data = await fetch("/api/getToken");
    let returnResult = await data.json();
    setApikey(returnResult.session_id);
  };
  const getStatus = async () => {
    if (analysisID != "") {
      const data = await fetch("/api/getStatus", {
        method: "POST",
        body: JSON.stringify({
          analysisID: analysisID,
          apikey: process.env.NEXT_PUBLIC_API_KEY,
        }),
      });
      let returnResult = await data.json();

      let file_value = {
        name: returnResult?.file_info?.display_name,
        type: returnResult?.file_info?.file_type_id,
        result: returnResult?.result,
        progress_percentage: returnResult?.process_info?.progress_percentage,
        scan_result: returnResult?.scan_results?.scan_all_result_a,
      };
      setScannedFile(file_value);
      if (returnResult?.process_info?.progress_percentage == 100) {
        setAnalysisID("");
        clearInterval(interval);
        if (
          returnResult?.scan_results?.scan_all_result_a ==
            "No Threat Detected" &&
          uploadingToS3 == false
        ) {
          uploadToS3Bucket();
        } else {
          alert("file is " + returnResult?.scan_results?.scan_all_result_a);
        }
      }
    }
  };
  useEffect(() => {
    // fetchToken();
  }, []);
  useEffect(() => {
    setAnalysisID("");
    /* it will be called when queues did update */
  }, [analysisID]);
  const onSubmitAsync = async (e: { preventDefault: () => void }) => {
    setUploadingToOpswat(true);
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
      headers.append("Content-Type", "application/json");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("workflowName", policyName + "");

      // formData.append("apikey", apikey + "");
      const data = await fetch("/api/upload-async", {
        method: "POST",
        body: formData,
      });

      let returnResult = await data.json();
      setUploadingToOpswat(false);
      if (returnResult?.err != "" && returnResult?.err != undefined) {
        // alert(returnResult?.err);
        // const data = await fetch("/api/refreshToken", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     apikey: apikey,
        //   }),
        // });
        // let returnToken = await data.json();
        // setApikey(returnToken.session_id);
      } else {
        setAnalysisID(returnResult.data_id);
        alert("File upload to OPSWAT successfully");
      }
    } catch (err) {
      alert("File upload failed");
      console.log(err);
    }
  };
  const onSubmitSync = async (e: { preventDefault: () => void }) => {
    setUploadingToOpswat(true);
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
      headers.append("Content-Type", "application/json");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("workflowName", policyName + "");

      // formData.append("apikey", apikey + "");
      const data = await fetch("/api/upload-sync", {
        method: "POST",
        body: formData,
      });

      let returnResult = await data.json();
      setUploadingToOpswat(false);
      if (returnResult?.err != "" && returnResult?.err != undefined) {
        // alert(returnResult?.err);
        // const data = await fetch("/api/refreshToken", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     apikey: apikey,
        //   }),
        // });
        // let returnToken = await data.json();
        // setApikey(returnToken.session_id);
      } else {
        if (
          returnResult?.scan_results?.scan_all_result_a == "No Threat Detected"
        ) {
          alert(
            "File scanned successfully with no threat detected, uploading to file server"
          );
          uploadToS3Bucket();
        } else {
          alert("file is " + returnResult?.scan_results?.scan_all_result_a);
        }
      }
    } catch (err) {
      alert("File upload failed");
      console.log(err);
    }
  };
  const uploadToS3Bucket = async () => {
    setUploadingToS3(true);

    if (file == null) {
      alert("No file found");
      return;
    }

    try {
      // var headers = new Headers();
      // headers.append("Content-Type", "application/json");
      // const formData = new FormData();
      // formData.append("file", file);

      // const data = await fetch("/api/upload-s3", {
      //   method: "POST",
      //   body: formData,
      // });

      // let returnResult = await data.json();
      // setUploadingToS3(false);
      alert("File uploaded to s3 successfully");
    } catch (err) {
      alert("File upload to s3 failed");
      console.log(err);
    }
  };
  return (
    <div>
      <select onChange={(e) => setMode(e.target.value)}>
        <option value="sync">Sync mode</option>
        <option value="async">Async mode</option>
      </select>
      {/* Scan mode: {mode}
      <br /> */}
      <form onSubmit={mode == "sync" ? onSubmitSync : onSubmitAsync}>
        Your Session Id: {process.env.NEXT_PUBLIC_API_KEY}
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

          {uploadingToOpswat ? <>uploading to OPSWAT for scanning...</> : <></>}
          {uploadingToS3 ? <>uploading to S3 bucket...</> : <></>}
          <label className="custom-file-label" htmlFor="customFile">
            {scannedFile != null ? (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className={`bg-blue-600 h-2.5 rounded-full `}
                    style={{ width: scannedFile.progress_percentage + "%" }}
                  ></div>
                  {scannedFile.progress_percentage}% {scannedFile.scan_result}
                </div>
              </>
            ) : (
              <></>
            )}
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
