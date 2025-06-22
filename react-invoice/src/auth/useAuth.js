import { useContext } from "react";
import { AuthCtx } from "./AuthProvider";

export default function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
