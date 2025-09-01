import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomAlert({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Slide & fade in
    gsap.fromTo(
      alertRef.current,
      { x: 200, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );

    // Auto-close after 2.5 seconds
    const timer = setTimeout(() => {
      gsap.to(alertRef.current, {
        x: 200,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: onClose,
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 flex justify-end">
      <div
        ref={alertRef}
        className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl 
                   text-gray-800 w-80 px-4 py-3 rounded-2xl 
                   flex flex-col items-center space-y-2"
      >
        <h2 className="text-lg font-semibold">{message}</h2>
      </div>
    </div>
  );
}
