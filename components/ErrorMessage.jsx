import React from "react";

export default function ErrorMessage({ name, error = null }) {
  return (
    <>
      {error && error[name]?.msg && (
        <p className="text-rose-500 text-xs">{error[name].msg}</p>
      )}
    </>
  );
}
