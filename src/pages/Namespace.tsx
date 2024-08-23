import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import NamespaceCard from "../components/namespace/NamespaceCard";
import { blazegraphService } from "../services/blazegraphService";
import classes from "./Namespace.module.scss";
import { ToastContainer, toast } from "react-toastify";
import { t } from "i18next";
import { Icon } from "@iconify/react";
import Button from "../components/UI/button/Button";
import Modal from "../components/UI/modal/Modal";

interface NamespaceResponse {
  namespaces: string[];
}

interface QueryResult {
  [key: string]: string;
}

const Namespace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [queryResult, setQueryResult] = useState<QueryResult[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false); // State for input modal
  const [newNamespaceName, setNewNamespaceName] = useState(""); // State to handle new namespace input

  useEffect(() => {
    blazegraphService
      .getNamespaces(Number(id))
      .then((response: NamespaceResponse) => {
        setNamespaces(response.namespaces);
      });
  }, [id]);

  const handleQuery = useCallback(
    async (namespace: string, query: string) => {
      console.log(`Received namespace: ${namespace}, Query: ${query}`); // Debugging
      try {
        const queryData = {
          id: Number(id),
          namespace_name: namespace,
          query,
        };
        const result = await blazegraphService.runSPARQLQuery(queryData);

        // Parse the XML result
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(result.result, "application/xml");

        // Extract results
        const results: QueryResult[] = [];

        const resultElements = xmlDoc.getElementsByTagName("result");
        for (const resultElement of Array.from(resultElements)) {
          const resultObj: QueryResult = {};
          const bindings = resultElement.getElementsByTagName("binding");

          for (const binding of Array.from(bindings)) {
            const name =
              binding.getAttribute("name") || `unknown_${Math.random()}`;
            const value = binding.textContent || "";
            resultObj[name] = value;
          }

          results.push(resultObj);
        }
        setQueryResult(results); // Store the parsed result in state

        if (results.length > 0) {
          toast.success("Query executed successfully");
        }
      } catch (error) {
        toast.error("Error running query");
        console.error("Error:", error);
        setIsModalOpen(false); // Close the modal even if there's an error
      }
    },
    [id]
  );

  const handleUploadFile = useCallback(
    (namespace: string, file: File) => {
      blazegraphService
        .uploadTTLFile({
          id: Number(id),
          namespace_name: namespace,
          ttl_file: file,
        })
        .then((response) => {
          toast.success("File uploaded successfully");
          setIsModalOpen(false); // Close the modal after success
        })
        .catch((error) => {
          toast.error("Error uploading file");
          setIsModalOpen(false); // Close the modal even if there's an error
        });
    },
    [id]
  );

  const handleIconClick = () => {
    setIsInputModalOpen(true); // Open the input modal
  };
  const handleIconClickOff = () => {
    setIsInputModalOpen(false); // Open the input modal
  };

  const handleInputSubmit = async () => {
    try {
      console.log("New Namespace Name:", newNamespaceName);
  
      // Prepare the data for the API call
      const namespaceData = {
        id: Number(id), // Assuming `id` is the instance ID from useParams
        namespace_name: newNamespaceName,
      };
  
      // Call the API to create the namespace
      const response = await blazegraphService.createNamespace(namespaceData);
  
      // Handle the response (e.g., show success message, update UI, etc.)
      toast.success(`Namespace "${response.namespace_name}" created successfully`);
  
      // Optionally update the UI with the new namespace
      setNamespaces((prevNamespaces) => [...prevNamespaces, response.namespace_name]);
  
      // Close the input modal after submission
      setIsInputModalOpen(false);
    } catch (error) {
      toast.error("Failed to create namespace");
      console.error("Error creating namespace:", error);
    }
  };
  

  return (
    <div className={classes.namespaceList}>
      <div className={classes.basicInfo__header}>
        <h2>{t("Active Namespace Information").toString()}</h2>
        <Icon
          icon="akar-icons:circle-plus"
          width="24"
          onClick={handleIconClick}
          style={{ cursor: "pointer" }}
        />
      </div>
      <ToastContainer />

      {namespaces.map((namespace) => (
        <NamespaceCard
          isModalOpenParent={isModalOpen}
          key={namespace}
          name={namespace}
          onRunQuery={(query) => handleQuery(namespace, query)} // Ensure this function receives data
          onUploadFile={(file) => handleUploadFile(namespace, file)}
          queryResult={queryResult} // Pass the query result down as a prop
        />
      ))}

      {/* Input Modal for New Namespace */}
      {isInputModalOpen && (
        <Modal
          title="Create New Namespace"
          message="Please enter the new namespace name."
          onConfirm={handleIconClickOff}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleInputSubmit();
            }}
          >
            <input
              type="text"
              value={newNamespaceName}
              onChange={(e) => setNewNamespaceName(e.target.value)}
              placeholder="Namespace Name"
              required
            />
            <Button type="submit">Create</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Namespace;
