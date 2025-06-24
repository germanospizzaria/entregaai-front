import { useMediaQuery } from "../hooks/use-mobile";

export const ResponsiveDebugger = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isSmall = useMediaQuery("(max-width: 640px)");
  const isLarge = useMediaQuery("(min-width: 1024px)");

  // Only show in development mode
  if (import.meta.env.MODE !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black text-white text-xs p-2 rounded shadow-lg z-50 font-mono">
      <div>Breakpoints:</div>
      <div>Mobile (&lt;768px): {isMobile ? "✓" : "✗"}</div>
      <div>Small (&lt;640px): {isSmall ? "✓" : "✗"}</div>
      <div>Tablet (&lt;1024px): {isTablet ? "✓" : "✗"}</div>
      <div>Large (&gt;=1024px): {isLarge ? "✓" : "✗"}</div>
      <div className="mt-1 text-xs opacity-75">
        {window.innerWidth}x{window.innerHeight}
      </div>
    </div>
  );
};
