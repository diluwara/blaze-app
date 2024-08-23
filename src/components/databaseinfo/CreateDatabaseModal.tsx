import React, { useState } from "react";
import { t } from "i18next";
import "./CreateDatabaseModal.scss";

interface CreateDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (formData: {
    databaseName: string;
    installationPath: string;
    port: string;
    minMemory: string;
    maxMemory: string;
  }) => void;
  isLoading: boolean; // Add isLoading prop to control the loading state
}

const CreateDatabaseModal: React.FC<CreateDatabaseModalProps> = ({
  isOpen,
  onClose,
  handleSubmit,
  isLoading, // Receive isLoading as a prop
}) => {
  const [formData, setFormData] = useState({
    databaseName: "your database name",
    installationPath: "data/",
    port: "9999",
    minMemory: "512M",
    maxMemory: "1024M",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose} disabled={isLoading}>
          &times;
        </button>
        <span>{t("Create a new database").toString()}</span>
        <br />
        <p>
          {t(
            "Enter the database name, installation path, and Port to create a new database."
          ).toString()}
        </p>
        <form onSubmit={onSubmit}>
          <div className="form-section">
            <br />
            <label>
              {t("Database Name").toString()}
              <input
                type="text"
                name="databaseName"
                value={formData.databaseName}
                onChange={handleChange}
                required
                disabled={isLoading} // Disable inputs while loading
              />
            </label>
            <label>
              {t("Installation Path").toString()}
              <input
                type="text"
                name="installationPath"
                value={formData.installationPath}
                onChange={handleChange}
                required
                disabled={isLoading} // Disable inputs while loading
              />
            </label>
            <label>
              {t("Port").toString()}
              <input
                type="text"
                name="port"
                value={formData.port}
                onChange={handleChange}
                required
                disabled={isLoading} // Disable inputs while loading
              />
            </label>
          </div>
          <div className="form-section">
            <h3>{t("Optional").toString()}</h3>
            <label>
              {t("Minimum Memory Usage (-Xms)").toString()}
              <input
                type="text"
                name="minMemory"
                value={formData.minMemory}
                onChange={handleChange}
                disabled={isLoading} // Disable inputs while loading
              />
            </label>
            <label>
              {t("Maximum Memory Usage (-Xmx)").toString()}
              <input
                type="text"
                name="maxMemory"
                value={formData.maxMemory}
                onChange={handleChange}
                disabled={isLoading} // Disable inputs while loading
              />
            </label>
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading
              ? t("Creating...").toString()
              : t("Create database").toString()}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDatabaseModal;
