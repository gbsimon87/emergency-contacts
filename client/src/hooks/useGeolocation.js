import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 8000,
  maximumAge: 60_000,
};

function mapGeolocationError(err) {
  // https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError
  if (!err || typeof err.code !== "number") {
    return {
      status: "error",
      message: "Location failed.",
    };
  }

  if (err.code === err.PERMISSION_DENIED) {
    return {
      status: "denied",
      message: "Location permission was denied.",
    };
  }

  if (err.code === err.POSITION_UNAVAILABLE) {
    return {
      status: "unavailable",
      message: "Location is unavailable on this device right now.",
    };
  }

  if (err.code === err.TIMEOUT) {
    return {
      status: "timed_out",
      message: "Location timed out. Please try again.",
    };
  }

  return { status: "error", message: "Location failed." };
}

export function useGeolocation(options = DEFAULT_OPTIONS) {
  const [state, setState] = useState({
    status: "not_requested", // not_requested | requesting | granted | denied | unavailable | timed_out | error
    coords: null, // { lat, lon }
    errorMessage: "",
    lastUpdatedAt: 0,
    permission: "unknown", // unknown | granted | denied | prompt
  });

  const permissionUnsubRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function initPermission() {
      try {
        if (!navigator.permissions?.query) return;

        const p = await navigator.permissions.query({ name: "geolocation" });
        if (cancelled) return;

        setState((s) => ({ ...s, permission: p.state }));

        const onChange = () => {
          setState((s) => ({ ...s, permission: p.state }));
        };

        p.addEventListener?.("change", onChange);
        permissionUnsubRef.current = () =>
          p.removeEventListener?.("change", onChange);
      } catch {
        // Permissions API isn’t reliable everywhere. Ignore safely.
      }
    }

    initPermission();

    return () => {
      cancelled = true;
      if (permissionUnsubRef.current) permissionUnsubRef.current();
    };
  }, []);

  const requestOnce = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = {
          status: "unavailable",
          message: "Location is not supported on this device.",
        };
        setState((s) => ({
          ...s,
          status: "unavailable",
          errorMessage: err.message,
          coords: null,
          lastUpdatedAt: Date.now(),
        }));
        reject(err);
        return;
      }

      setState((s) => ({
        ...s,
        status: "requesting",
        errorMessage: "",
      }));

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos?.coords?.latitude;
          const lon = pos?.coords?.longitude;

          if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            const err = {
              status: "error",
              message: "Location returned invalid coordinates.",
            };
            setState((s) => ({
              ...s,
              status: "error",
              errorMessage: err.message,
              coords: null,
              lastUpdatedAt: Date.now(),
            }));
            reject(err);
            return;
          }

          const coords = { lat, lon };
          setState((s) => ({
            ...s,
            status: "granted",
            coords,
            errorMessage: "",
            lastUpdatedAt: Date.now(),
          }));
          resolve(coords);
        },
        (err) => {
          const mapped = mapGeolocationError(err);
          setState((s) => ({
            ...s,
            status: mapped.status,
            coords: null,
            errorMessage: mapped.message,
            lastUpdatedAt: Date.now(),
          }));
          reject(mapped);
        },
        options,
      );
    });
  }, [options]);

  const reset = useCallback(() => {
    setState((s) => ({
      ...s,
      status: "not_requested",
      coords: null,
      errorMessage: "",
      lastUpdatedAt: Date.now(),
    }));
  }, []);

  return { location: state, requestOnce, reset };
}
