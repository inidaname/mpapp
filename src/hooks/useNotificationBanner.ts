import { useCallback, useState } from "react";

export default function useNotificationBanner() {
  const [banner, setBanner] = useState({
    visible: false,
    title: "",
    body: "",
  });

  const showBanner = useCallback((title: string, body: string) => {
    setBanner({ visible: true, title, body });
  }, []);

  const hideBanner = useCallback(() => {
    setBanner((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    banner,
    showBanner,
    hideBanner,
  };
}
