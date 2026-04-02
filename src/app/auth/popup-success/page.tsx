"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function PopupSuccessInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.opener) {
      const isNewUser = searchParams.get("new_user") === "true";
      window.opener.postMessage(
        { type: "oauth_success", isNewUser },
        window.location.origin
      );
    }
    window.close();
  }, [searchParams]);

  return null;
}

export default function PopupSuccessPage() {
  return (
    <Suspense>
      <PopupSuccessInner />
    </Suspense>
  );
}
