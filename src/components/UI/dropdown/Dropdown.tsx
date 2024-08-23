import React from "react";
import { t } from "i18next";
import classes from "./Dropdown.module.scss";

type TOptionItem = {
  label: string;
  value: string;
};

interface DropdownProps {
  dropdownData: TOptionItem[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ dropdownData, onChange }) => {
  return (
    <div className={`subTitle ${classes.form__control}`}>
      <label htmlFor="category">{t("category").toString()}</label>
      <select
        name="category"
        className={classes.select}
        id="category"
        onChange={onChange}
      >
        {dropdownData.map((item, index) => (
          <option key={`${item.label}-${index}`} value={item.value}>
            {t(item.label).toString()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
