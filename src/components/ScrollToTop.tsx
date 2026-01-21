import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Prevent the browser from restoring scroll position on route changes
    // (common when navigating while scrolled down).
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Use rAF so it runs after the next paint/navigation commit.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
