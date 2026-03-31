import { useEffect, useState } from "react";

function useFakeLoading(durationMs = 200) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoading(false), durationMs);
    return () => clearTimeout(timeoutId);
  }, [durationMs]);

  return isLoading;
}

export default useFakeLoading;
