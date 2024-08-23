import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import i18n from "../locale";

type LangContextObj = {
  lang: string | null;
  toggleLanguage: (sLang: string) => void;
};

const LangContext = React.createContext<LangContextObj>({
  lang: "",
  toggleLanguage: () => {},
});

export const LangContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [lang, setLang] = useLocalStorage("language", "en");

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  function toggleLanguage(sLang: string) {
    setLang(sLang);
  }

  const langValue: LangContextObj = {
    lang,
    toggleLanguage,
  };

  return (
    <LangContext.Provider value={langValue}>
      {props.children}
    </LangContext.Provider>
  );
};

export default LangContext;
