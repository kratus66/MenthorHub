import axiosInstance from "./axiosInstance";

class ServerChecker {
    static async checkServer(): Promise<boolean> {
        try {
            const response = await axiosInstance.head('/');
            console.log('Servicor activo:', response.status);
            return true;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Servidor no accesible:', error.message);
            } else {
                console.error('Servidor no accesible:', error);
            }
            return false;
        }
    }
}

export default ServerChecker;