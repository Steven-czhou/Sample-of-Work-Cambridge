// App.jsx
import React, { useState } from 'react';
import { RenderProvider } from './context/RenderContext';
import { ThemeColorProvider } from './context/ThemeColorContext';
import UserLoggedin from './auth/UserLoggedin';
import UserLogin from './auth/UserLogin';

const App = () => {
  const [isLoggedin, setIsloggedin] = useState(true);
  const handleLoggedin = ()=> {
    console.log(1);
    console.log(sessionStorage.getItem("token"));
    setIsloggedin(false);
  }

  const handleLoggedOut = () => {
    console.log(sessionStorage.getItem("token"));
    setIsloggedin(true);
  }

  const handleDeleteAccount = async () => {
    let token = sessionStorage.getItem("token");
  
    if (!token) {
      console.error("No token found. Please log in.");
      alert("You need to log in to delete your account.");
      return;
    }
  
    try {
      const response = await fetch("api/v1/auth/delete", {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting account:", errorData.message || "Unknown error");
        alert(`Error: ${errorData.message || "Failed to delete account"}`);
        return;
      }
  
      const result = await response.json();
      console.log("Account deleted successfully:", result);
      setIsloggedin(true);
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <ThemeColorProvider>
    <RenderProvider>
      {isLoggedin ? (
        <>
          <UserLogin handleLoggedin={handleLoggedin}/>
        </>
      ) : (
        <>
          <UserLoggedin handleLoggedOut={handleLoggedOut} handleDeleteAccount={handleDeleteAccount}/>
        </>
      )}
    </RenderProvider>
    </ThemeColorProvider>
  );

}

export default App;
