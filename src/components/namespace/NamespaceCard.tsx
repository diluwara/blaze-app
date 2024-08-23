import React, { useState, useEffect } from "react";
import Button from "../UI/button/Button"; // Assuming you have a Button component
import Modal from "../UI/modal/Modal"; // Import the Modal component
import classes from "./NamespaceCard.module.scss";

interface NamespaceCardProps {
  name: string;
  onRunQuery: (query: string) => void; // Callback for running the query
  onUploadFile: (file: File) => void; // Callback for uploading the file
  isModalOpenParent: boolean; // Prop from parent to control modal visibility
  queryResult: { [key: string]: string }[]; // Result of the query should be an array of objects
}

const NamespaceCard: React.FC<NamespaceCardProps> = ({
  name,
  onRunQuery,
  onUploadFile,
  isModalOpenParent,
  queryResult,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [localQueryResult, setLocalQueryResult] = useState(queryResult);

  useEffect(() => {
    setLocalQueryResult(queryResult);
  }, [isModalOpenParent, queryResult]);

  const handleQueryClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setLocalQueryResult([]);
  };

  const handleRunQuery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query) {
      onRunQuery(query); // This sends the query to the parent component
      setQuery(""); // Clear query field
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target.files;
    if (fileInput && fileInput.length > 0) {
      setFile(fileInput[0]);
    }
  };

  const handleUploadFile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      onUploadFile(file);
      setFile(null); // Clear file input
      handleModalClose(); // Close the modal after uploading the file
    }
  };

  return (
    <div className={classes.card}>
      <h3 className={classes.card__title}>
        Namespace Name: {name.toUpperCase()}
      </h3>
      <Button onClick={handleQueryClick}>Query</Button>

      {isModalOpen && (
        <Modal
          title={`Query or Upload TTL for ${name}`}
          message={`You can run a SPARQL query or upload a TTL file to the ${name} namespace.`}
          onConfirm={() => handleModalClose()}
        >
          {localQueryResult.length > 0 ? (
            <div className={classes.queryResult}>
              <h2>Query Results</h2>
              <table>
                <thead>
                  <tr>
                    {Object.keys(localQueryResult[0]).map((key, index) => (
                      <th key={index}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {localQueryResult.map((result, index) => (
                    <tr key={index}>
                      {Object.values(result).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <form className={classes.form} onSubmit={handleRunQuery}>
                <span>SPARQL Query:</span>
                <textarea
                  rows={4}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit">Run Query</Button>
              </form>

              <form className={classes.form} onSubmit={handleUploadFile}>
                <span>Upload TTL File:</span>
                <input type="file" onChange={handleFileChange} />
                <Button type="submit">Upload File</Button>
              </form>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

export default NamespaceCard;
