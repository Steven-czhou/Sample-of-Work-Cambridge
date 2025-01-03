import React, { createContext, useState } from "react";

const ThemeColorContext = createContext();

export const ThemeColorProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState({buttonColor:"#00BFFF", boardColor:"#80fdff", barColor:"#80fdff", wordColor:"black" , stageColor:"#80fdff", });

  return (
    <ThemeColorContext.Provider value={[themeColor, setThemeColor]}>
      {children}
    </ThemeColorContext.Provider>
  );
};

export default ThemeColorContext;