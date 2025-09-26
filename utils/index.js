import { toast } from "sonner";

const loadedAnimations = new Map();

export async function initLottie(container, path) {
  if (typeof window === "undefined") return;

  if (
    loadedAnimations.has(container) &&
    loadedAnimations.get(container) === path
  ) {
    return;
  }

  const loadLottieScript = () => {
    return new Promise((resolve, reject) => {
      if (window.lottie) {
        resolve();
      } else {
        const script = document.createElement("script");
        script.src = "/js/lottie.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      }
    });
  };

  await loadLottieScript();

  window.lottie.loadAnimation({
    container: container,
    renderer: "canvas",
    loop: true,
    autoplay: true,
    path: path,
  });

  loadedAnimations.set(container, path);
}

export function print(data) {
  return JSON.stringify(data, null, 4);
}

export function getItem(key, defaultValue = null) {
  if (typeof window === "undefined") return;
  const item = localStorage.getItem(key);
  return item ?? defaultValue;
}

export function setItem(key, value) {
  localStorage.setItem(key, value);
}

export function removeItem(key) {
  localStorage.removeItem(key);
}

export function appendForm(obj, formData) {
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else {
      formData.append(key, value);
    }
  });
}

export function stringSlug(string, sign = "-") {
  return string
    .toLowerCase() // Convert to lowercase
    .replace(/[\s_&]+/g, sign) // Replace spaces, underscores, and '&' with hyphens
    .replace(/-+/g, sign) // Replace multiple hyphens with a single hyphen
    .replace(/[^\w\-]/g, "") // Remove all non-word characters except hyphens
    .replace(/^-|-$/g, ""); // Remove hyphens at the start or end of the string
}

export function objToQuery(obj) {
  return new URLSearchParams(obj).toString();
}

export function randomKey(length = 5, stringOnly = false) {
  if (stringOnly) {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    return [...Array(length)]
      .map(() => characters[Math.floor(Math.random() * characters.length)])
      .join("");
  } else {
    return [...Array(length)].map(() => Math.random().toString(36)[2]).join("");
  }
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function paginate(array = [], perPage = 24) {
  return { page: Math.ceil(array.length / perPage), perPage };
}

export function errorToast(error) {
  if (error?.error?.toast) {
    toast.error(error.error.toast);
  }
}

export function dateFormat(date) {
  if (!date) return "";
  const newDate = new Date(date);
  if (isNaN(newDate.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(newDate);
}
