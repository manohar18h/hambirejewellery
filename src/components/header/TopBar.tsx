import { useEffect, useState } from "react";

const messages = [
  "Save the BIG Joy for later through our Easy Gold Scheme",
  "Join our Gold Scheme today & shine brighter tomorrow",
];

const TopBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        background: "#b91c1c",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        color: "white",
        letterSpacing: "0.05em",
      }}
    >
      <span>
        {messages[index]}
        <span
          style={{
            marginLeft: "6px",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Click to Join Scheme
        </span>
      </span>
    </div>
  );
};

export default TopBar;
