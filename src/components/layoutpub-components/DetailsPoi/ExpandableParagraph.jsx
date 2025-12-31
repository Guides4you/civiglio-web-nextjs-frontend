import { useState, useEffect } from "react";

const ExpandableParagraph = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !text) {
    return <div style={{ height: "72px" }}></div>;
  }

  const shouldTruncate = text.length > 150;

  return (
    <div style={{ width: "100%", maxWidth: "600px", position: "relative" }}>
      <div>
        {isExpanded ? text : `${text.slice(0, 150)}${shouldTruncate ? '...' : ''}`}{" "}
        {shouldTruncate && (
          <span
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Mostra meno" : "Mostra di più"}
          </span>
        )}
      </div>
    </div>
  );
};

export default ExpandableParagraph;
