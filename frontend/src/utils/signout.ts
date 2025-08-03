import axios from "axios";

export const signOut = async () => {
  const refresh = localStorage.getItem("refresh");
  const access = localStorage.getItem("access");

  try {
    if (refresh && access) {
      await axios.post(
        "http://localhost:8000/blog/logout/",
        { refresh },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
    }
  } catch (error) {
    console.warn("Logout API failed:", error);
  }

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  window.location.href = "/signin";
};
