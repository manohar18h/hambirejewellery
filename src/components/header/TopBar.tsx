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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
   <div className="flex min-h-[25px] items-center justify-center bg-[#FE7F00] px-2 py-1 text-center text-[10px] text-white tracking-[0.05em] md:text-[12px]">
      <span>
        {messages[index]}
       <span
  className="ml-1 cursor-pointer underline text-[10px] md:text-[12px]"
>
  Click to Join Scheme
</span>
      </span>
    </div>
  );
};

export default TopBar;
