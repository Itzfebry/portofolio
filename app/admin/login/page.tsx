import type { Metadata } from "next";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: { absolute: "ItzFebryHcx | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="hack-terminal">
      <div className="hack-window">
        <div className="hack-window__bar">
          <span className="hack-window__dot" />
          <span className="hack-window__dot" />
          <span className="hack-window__dot" />
          <span className="hack-window__title">secure-access — ssh</span>
        </div>

        <div className="hack-window__body">
          <p className="hack-line">
            <span className="prompt">$</span>./login.sh --restricted
          </p>
          <p className="hack-line hack-line--muted">
            Sesi dilindungi. Hanya kata sandi yang diterima pada jalur ini.
          </p>

          <div className="hack-divider" />

          <p className="hack-label" id="secret-label">
            &gt; masukkan kata sandi
          </p>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
