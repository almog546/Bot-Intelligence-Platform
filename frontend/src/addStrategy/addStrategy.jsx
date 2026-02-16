import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function UploadStrategy() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function handleUpload() {
    try {
      if (!selectedFile) {
        setError("Please select a CSV file");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", name);

      const response = await api.post(
        "/api/strategies/upload",
        formData,
      );
     

      const { strategyId } = response.data;
      navigate(`/strategy/${strategyId}`);

    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed"
      );
    }
  }

  return (
    <div>

      <h2>Upload Strategy</h2>
      <form action="" onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Strategy Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button >Upload</button>

      {error && <p>{error}</p>}
      </form>
    </div>
  );
}
