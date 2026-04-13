import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

function getApiBaseUrl(): string {
  const defaultHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  let host = defaultHost;

  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      host = window.location.hostname || defaultHost;
    }
  } else {
    const debuggerHost =
      (Constants.manifest as any)?.debuggerHost ||
      (Constants.expoConfig as any)?.host?.split(":")[0];

    if (typeof debuggerHost === "string") {
      const ipCandidate = debuggerHost.split(":")[0];
      if (
        ipCandidate &&
        ipCandidate !== "localhost" &&
        ipCandidate !== "127.0.0.1"
      ) {
        host = ipCandidate;
      }
    }
  }

  return `http://${host}:8000/api`;
}

export const API_BASE_URL = getApiBaseUrl();

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem("authToken");
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      `Unable to connect to backend at ${url}. Start the Django server and verify the API URL.`,
    );
  }

  const text = await response.text();
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      data?.error || data?.detail || data?.message || response.statusText;
    throw new Error(message || "Request failed");
  }

  return data;
}

export async function login(email: string, password: string) {
  const data = await request("/auth/", {
    method: "POST",
    body: JSON.stringify({ username: email, password }),
  });

  await AsyncStorage.setItem("authToken", data.token);
  await AsyncStorage.setItem("currentUser", data.email || email);
  return data;
}

export async function signup(
  username: string,
  email: string,
  password: string,
) {
  const data = await request("/register/", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });

  await AsyncStorage.setItem("authToken", data.token);
  await AsyncStorage.setItem("currentUser", data.email || email);
  return data;
}

export async function logout() {
  await request("/auth/logout/", {
    method: "POST",
  });
  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("currentUser");
}

export async function getProfile() {
  return request("/profile/");
}

export async function getDevices() {
  return request("/devices/");
}

export async function getSchedules() {
  return request("/schedules/");
}

export async function getLogs() {
  return request("/logs/");
}

export async function feedDevice(
  deviceId: number,
  amount: number,
  scheduleId?: number,
) {
  return request("/devices/feed/", {
    method: "POST",
    body: JSON.stringify({
      device_id: deviceId,
      amount,
      schedule_id: scheduleId,
    }),
  });
}
