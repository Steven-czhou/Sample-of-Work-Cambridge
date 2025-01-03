import React, { createContext, useState } from "react";

const RenderContext = createContext();

export const RenderProvider = ({ children }) => {
  const [render, setRender] = useState("");

  return (
    <RenderContext.Provider value={[render, setRender]}>
      {children}
    </RenderContext.Provider>
  );
};

export default RenderContext;