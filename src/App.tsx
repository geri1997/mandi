import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    fetchFileNames();
  }, []);

  const fetchFileNames = async () => {
    const response = await axios.get("http://192.168.4.192:9995/audio/list");
    if (!Array.isArray(response.data)) {
      setFileNames([]);
    } else {
      setFileNames(response.data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const uploadFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post("http://192.168.4.192:9995/audio/upload", formData);
      fetchFileNames();
    }
  };

  const playAudio = async (fileName: string) => {
    const confirmPlay = window.confirm(`Do you want to play "${fileName}"?`);
    if (confirmPlay) {
      await axios.post("http://192.168.4.192:9995/audio/play", { fileName });
      alert(`Playing: ${fileName}`);
    }
  };

  const runCommand = async (fileName: string) => {
    const confirmPlay = window.confirm(`Do you want to play "${fileName}"?`);
    if (confirmPlay) {
      await axios.post("http://192.168.4.192:9995/audio/command", {
        command: input,
      });
      alert(`Playing: ${fileName}`);
    }
  };

  return (
    <div>
      <h2>Upload Audio</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>

      <h2>Audio Files</h2>
      <button onClick={fetchFileNames}>Refresh File List</button>
      <ul>
        {fileNames.map((name) => (
          <li
            key={name}
            onClick={() => playAudio(name)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {name}
          </li>
        ))}
      </ul>

      <hr></hr>
      cdo gj qe shkrun tek inputi posht esht njesoj si ta shkruash ne terminal te armandos. base directory ku bajn run kto esht ~
      <br></br>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={() => runCommand(input)}>Play</button>
    </div>
  );
}

export default App;
