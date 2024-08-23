import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { IDatabaseInfo } from "../../interfaces/IDatabaseInfo";
import classes from "./DatabaseInfo.module.scss";
import DatabaseInfoBox from "./DatabaseInfoBox";
import { blazegraphService } from "../../services/blazegraphService";
import { t } from "i18next";
import CreateDatabaseModal from "./CreateDatabaseModal";
import { ToastContainer, toast } from "react-toastify";

function DatabaseInfo() {
  const [basicInfoData, setBasicInfoData] = useState<IDatabaseInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch data directly
  const fetchData = async () => {
    try {
      const data = await blazegraphService.getAllInstances();
      setBasicInfoData(data);
    } catch (error) {
      toast.error("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIconClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (newData: {
    databaseName: string;
    installationPath: string;
    port: string;
    minMemory: string;
    maxMemory: string;
  }) => {
    setIsLoading(true);

    const dataToSend = {
      instance_name: newData.databaseName,
      port: parseInt(newData.port, 10),
      install_path: newData.installationPath,
      min_memory: newData.minMemory,
      max_memory: newData.maxMemory,
      ip_address: "localhost", // Modify if needed
    };

    blazegraphService
      .createInstance(dataToSend)
      .then((response) => {
        if (response.instance_name) {
          toast.success("Database created successfully!");
          fetchData(); // Refetch data after creation
          handleModalClose();
        } else if (Array.isArray(response) && response[1] !== 200) {
          const errorMsg =
            response[0]?.error ||
            "Failed to create database. Please try again.";
          toast.error(errorMsg);
        } else {
          toast.error("Unexpected response format. Please try again.");
        }
      })
      .catch((error: any) => {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.";
        toast.error(errorMsg);
        console.error("Failed to create new database:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section>
      <section className={classes.basicInfo}>
        <ToastContainer />
        <div className={classes.basicInfo__header}>
          <h2>{t("Active Database Information").toString()}</h2>
          <Icon
            icon="akar-icons:circle-plus"
            width="24"
            onClick={handleIconClick}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Display loading indicator */}
        {isLoading && (
          <div className={classes.loadingMessage}>Processing...</div>
        )}

        <div className={classes.basicInfo__box}>
          {basicInfoData.length > 0 ? (
            basicInfoData.map((item) => (
              <DatabaseInfoBox key={item.id} data={item} refetch={fetchData} />
            ))
          ) : (
            <div>{t("No data available").toString()}</div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <CreateDatabaseModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
    </section>
  );
}

export default DatabaseInfo;
