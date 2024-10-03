import React, { useEffect } from "react";

import { BrowserRouter, HashRouter } from "react-router-dom";
import { routes } from "./routes/index";
import Header from "./components/Header/Header";
import { useSelector } from "react-redux";
import { ScrollToTopOnMount } from "./components/Scroll/ScrollToTopOnMount";

function App() {
  const toggleDarkMode = useSelector((state) => state.toggle.toggleDarkLight);



  useEffect(() => {
    if (toggleDarkMode) {
      localStorage.setItem("dark-mode", "true");
      document.getElementById("root").classList.add(toggleDarkMode ? "dark-mode" : "text");
    } else {
      localStorage.setItem("dark-mode", "false");

        document.getElementById("root").classList.remove("dark-mode");
    }
  }, [toggleDarkMode]);

  return (
    <HashRouter>
      <Header />
      <ScrollToTopOnMount/>
      {routes}
    </HashRouter>
  );
}

export default App;
