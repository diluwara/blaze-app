import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IDatabaseInfo as Props } from "../../interfaces/IDatabaseInfo";
import Card from "../UI/card/Card";
import classes from "./DatabaseInfoBox.module.scss";
import usePost from "../../hook/usePost";
import { blazegraphService } from "../../services/blazegraphService";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

interface DatabaseInfoBoxProps {
  data: Props;
  refetch: () => void;
}

const DatabaseInfoBox: React.FC<DatabaseInfoBoxProps> = ({ data, refetch }) => {
  const { t } = useTranslation();
  const [dbStatus, setDBStatus] = useState(data.status);
  const navigate = useNavigate();

  const [, stopInstance] = usePost(blazegraphService.stopInstance);
  const [, startInstance] = usePost(blazegraphService.startInstance);

  const toggleStatus = async () => {
    const newStatus = dbStatus === "running" ? "stopped" : "running";
    setDBStatus(newStatus);

    try {
      dbStatus === "running"
        ? await stopInstance(data.id)
        : await startInstance(data.id);
      refetch();
    } catch (error) {
      console.error("Failed to stop instance:", error);
      setDBStatus(data.status);
    }
  };
  return (
    <div className={classes.basicInfo__box}>
      <Card>
        <div className={classes.basicInfo__box__wrapper}>
          <div className={classes.basicInfo__box__info}>
            <h1>{t("Basic Information").toString()}</h1>
            <p>{t("Database Name").toString()}:</p>
            <p>{t("IP Address").toString()}:</p>
            <p>{t("Port").toString()}:</p>
            <p>{t("Pid").toString()}:</p>
          </div>
          <div className={classes.basicInfo__box__info}>
            <br />
            <span>{t(data.instance_name).toString()}</span>
            <span>{t(data.ip_address).toString()}</span>
            <span>{data.port}</span>
            <span>{data.pid}</span>
          </div>
          <div className={classes.basicInfo__box__info}>
            <h1>{t("Additional Information").toString()}</h1>
            <p>{t("Database Folder").toString()}:</p>
            <p>{t("Max Memory").toString()}:</p>
            <p>{t("Min Memory").toString()}:</p>
            <p>{t("Status").toString()}:</p>
          </div>
          <div className={classes.basicInfo__box__info}>
            <br />
            <span>{t(data.folder).toString()}</span>
            <span>{t(data.max_memory).toString()}</span>
            <span>{t(data.min_memory).toString()}</span>
            <span>{dbStatus}</span>
          </div>
          <div className={classes.basicInfo__box__info}>
            <h1>
              {dbStatus === "running" ? "Stop Database" : "Start Database"}
            </h1>
            <br />
            <div
              className={`${classes.basicInfo__box__info__status} ${
                dbStatus === "running" ? classes.runmode : ""
              }`}
              onClick={toggleStatus}
            >
              <div
                className={`${classes.basicInfo__box__info__status__toggle} ${
                  dbStatus === "running" ? classes.runmode : ""
                }`}
              ></div>
            </div>
          </div>
          <div className={classes.basicInfo__box__info}>
            <br />
            <br />
            <Icon
              icon="akar-icons:arrow-right"
              width="24"
              className={classes.arrowIcon}
              onClick={() => navigate(`/namespace/${data.id}`)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DatabaseInfoBox;
