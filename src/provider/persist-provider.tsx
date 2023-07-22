"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/context/store/store";

export default function PersistProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener("beforeunload", () => {
        persistor.flush();
        setLoading(true);
      });
    }
    setLoading(false);

    return () => {
      window.removeEventListener("beforeunload", () => {
        persistor.flush();
        setLoading(true);
      });
    };
  }, []);

  useEffect(() => {
    const documentHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
    };
    window.addEventListener("resize", documentHeight);
    documentHeight();

    return () => {
      window.removeEventListener("resize", documentHeight);
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={loading}>
        {children}
      </PersistGate>
    </Provider>
  );
}
