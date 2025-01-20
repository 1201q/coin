"use client";
import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${styles.container} ${isExpanded ? styles.expanded : ""}`}>
      <button
        onClick={() => {
          setIsExpanded((prev) => !prev);
        }}
      >
        1
      </button>
    </div>
  );
}
