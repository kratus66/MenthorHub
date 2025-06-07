import axiosInstance from "./axiosInstance";

class ServerChecker {
  static async checkServer(): Promise<boolean> {
    try {
      const response = await axiosInstance.head("/");
      if (response.status === 200) {
        return true;
      } else {
        console.error(
          "Servidor no accesible, código de estado:",
          response.status
        );
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Servidor no accesible:", error.message);
      } else {
        console.error("Servidor no accesible:", error);
      }
      return false;
    }
  }
}

export default ServerChecker;
