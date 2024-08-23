import axios from "axios";

// Create an axios instance with the Ngrok skip browser warning header
const axiosInstance = axios.create({
  baseURL: "https://e366-172-207-24-191.ngrok-free.app/",
  headers: {
    "ngrok-skip-browser-warning": "true", // This header bypasses the Ngrok warning page
  },
});

export const blazegraphService = {
  // Fetch all instances
  getAllInstances: async () => {
    try {
      const response = await axiosInstance.get("/get_all_instances");
      return response.data;
    } catch (error) {
      console.error("Error fetching all instances:", error);
      throw error;
    }
  },

  // Fetch a single instance by ID
  getInstanceById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/get_instance/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching instance with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new instance
  createInstance: async (instanceData: any) => {
    try {
      const response = await axiosInstance.post(
        "/create_instance",
        instanceData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating instance:", error);
      throw error;
    }
  },

  // Start an instance by ID
  startInstance: async (id: number) => {
    try {
      const response = await axiosInstance.post("/start_instance", { id });
      return response.data;
    } catch (error) {
      console.error(`Error starting instance with ID ${id}:`, error);
      throw error;
    }
  },

  // Stop an instance by ID
  stopInstance: async (id: number) => {
    try {
      const response = await axiosInstance.post("/stop_instance", { id });
      return response.data;
    } catch (error) {
      console.error(`Error stopping instance with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new namespace
  createNamespace: async (namespaceData: {
    id: number;
    namespace_name: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        "create_namespace",
        namespaceData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating namespace:", error);
      throw error;
    }
  },

  // Upload a TTL file to a namespace
  uploadTTLFile: async (ttlData: {
    id: number;
    namespace_name: string;
    ttl_file: File;
  }) => {
    try {
      const formData = new FormData();
      formData.append("id", ttlData.id.toString());
      formData.append("namespace_name", ttlData.namespace_name);
      formData.append("ttl_file", ttlData.ttl_file);

      const response = await axiosInstance.post("/upload_ttl", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading TTL file:", error);
      throw error;
    }
  },

  // Run a SPARQL query in a namespace
  runSPARQLQuery: async (queryData: {
    id: number;
    namespace_name: string;
    query: string;
  }) => {
    try {
      const response = await axiosInstance.post("/run_query", queryData);
      return response.data;
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      throw error;
    }
  },

  // Fetch namespaces for a specific instance by ID
  getNamespaces: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/get_namespaces/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching namespaces for instance with ID ${id}:`,
        error
      );
      throw error;
    }
  },
};
