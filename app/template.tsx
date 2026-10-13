import type { ReactNode } from "react";

export default function PageTemplate({ children }: { children: ReactNode }) {
  return <div className="page-entry">{children}</div>;
}
