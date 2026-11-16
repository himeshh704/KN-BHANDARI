export function isWindowScroller(scroller: Element | Window): scroller is Window {
  return scroller === window || typeof (scroller as Window).document !== "undefined";
}

export function observeWindowResize(callback: () => void): () => void {
  let timeoutId: number | null = null;
  const handler = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      callback();
    }, 100);
  };

  window.addEventListener("resize", handler, { passive: true });
  return () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    window.removeEventListener("resize", handler);
  };
}

export async function waitForScrollerReady(scroller: Element | Window): Promise<void> {
  if (typeof window === "undefined") return;

  if (document.readyState === "complete" || document.readyState === "interactive") {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    return;
  }

  await new Promise<void>((resolve) => {
    const onLoad = () => {
      window.removeEventListener("DOMContentLoaded", onLoad);
      window.removeEventListener("load", onLoad);
      resolve();
    };
    window.addEventListener("DOMContentLoaded", onLoad, { once: true });
    window.addEventListener("load", onLoad, { once: true });
  });
}
