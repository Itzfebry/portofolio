import type { Metadata } from "next";

import AdminNav from "@/components/ui/admin-nav";
import MatrixRain from "@/components/ui/matrix-rain";
import { hasAdminSession } from "@/lib/admin";

import { signOutAdmin } from "./actions";
import "./admin.css";

export const metadata: Metadata = {
  title: { absolute: "ItzFebryHcx | Admin" },
  description: "Secure administration console for the ItzFebryHcx portfolio.",
  robots: { index: false, follow: false },
};

function Backdrop() {
  return (
    <>
      <MatrixRain className="hack-rain" />
      <div className="hack-scanlines" aria-hidden="true" />
      <div className="hack-vignette" aria-hidden="true" />
    </>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await hasAdminSession();

  // No session yet (login page, or first visit): render a bare terminal.
  if (!authenticated) {
    return (
      <div className="admin-hack admin-hack--auth">
        <Backdrop />
        <div className="hack-bare">{children}</div>
      </div>
    );
  }

  return (
    <div className="admin-hack">
      <Backdrop />

      <div className="hack-shell">
        <aside className="hack-side">
          <div className="hack-brand">
            <span className="hack-brand__mark" aria-hidden="true">
              ▮
            </span>
            <div>
              <p className="hack-brand__name">ItzFebryHcx</p>
              <p className="hack-brand__path">portfolio ~/admin</p>
            </div>
          </div>

          <AdminNav />

          <div className="hack-side__foot">
            <span className="hack-status">
              <i aria-hidden="true" />
              session online
            </span>
            <form action={signOutAdmin}>
              <button type="submit" className="hack-btn hack-btn--danger">
                ./logout.sh
              </button>
            </form>
          </div>
        </aside>

        <main className="hack-main">
          <div className="hack-topbar">
            <span className="hack-topbar__path">admin console</span>
            <span className="hack-topbar__secure">encrypted channel</span>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
