import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import styles from "./AddStrategy.module.css";

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
     

      
      navigate(`/`);

    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed"
      );
    }
  }

  return (
    <div className={styles.container}>
      

      <h2 className={styles.title}>Upload Strategy</h2>
      <form action="" onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Strategy Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />

      <input type="file" accept=".csv" onChange={handleFileChange} className={styles.fileInput} />
      <button type="button" onClick={handleUpload} className={styles.uploadButton}>Upload</button>

      {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
