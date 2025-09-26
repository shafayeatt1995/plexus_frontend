import { jwtToken } from "@/services/nextAuth";

const api = {
  async request(method, url, jsonBody = null, formData = null, params = null) {
    const token = await jwtToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const options = {
      method,
      headers: formData ? {} : headers,
      body: formData || (jsonBody && JSON.stringify(jsonBody)),
    };

    const query = params ? `?${new URLSearchParams(params)}` : "";
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + url + query,
      options
    );

    if (!response.ok) {
      const error = await response.json();
      throw {
        status: response.status,
        message: error.message || `Error ${response.status}`,
        error,
      };
    }

    return await response.json();
  },

  get(url, params) {
    return this.request("GET", url, null, null, params);
  },

  post(url, jsonBody = null, formData = null) {
    return this.request("POST", url, jsonBody, formData);
  },

  put(url, jsonBody = null, formData = null) {
    return this.request("PUT", url, jsonBody, formData);
  },

  delete(url, params) {
    return this.request("DELETE", url, null, null, params);
  },
};

export default api;
