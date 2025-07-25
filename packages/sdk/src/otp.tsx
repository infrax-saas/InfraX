import React, { useState } from "react";
import { createRoot } from "react-dom/client";

export const OtpPrompt = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (otp: string) => void;
  onCancel: () => void;
}) => {
  const [otp, setOtp] = useState("");

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Enter OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit code"
        />
        <button onClick={() => onSubmit(otp)}>Verify</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
  },
  modal: {
    backgroundColor: "white", padding: 20, borderRadius: 10, display: "flex", flexDirection: "column", gap: 10
  }
};

export function showOtpPrompt(): Promise<string> {
  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    const handleSubmit = (otp: string) => {
      cleanup();
      resolve(otp);
    };

    const handleCancel = () => {
      cleanup();
      reject(new Error("OTP entry cancelled"));
    };

    const cleanup = () => {
      root.unmount();
      container.remove();
    };

    root.render(<OtpPrompt onSubmit={handleSubmit} onCancel={handleCancel} />);
  });
}
