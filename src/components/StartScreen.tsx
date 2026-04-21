import { useMemo, useState } from "react";
import BrandingFooter from "./BrandingFooter";
import { exitAppFullscreen, requestAppFullscreen } from "../fullscreen";

type Props = {
  onStart: () => void;
  onHost: () => void;
  onPresentation: () => void;
};

const HOST_PASSWORD = "Eric777";
const PHONE_PLAY_URL = "http://172.24.23.243:5173/";

export default function StartScreen({ onStart, onHost, onPresentation }: Props) {
  const [hostPassword, setHostPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showQrFullscreen, setShowQrFullscreen] = useState(false);

  const playUrl = useMemo(() => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return PHONE_PLAY_URL;
    }

    return window.location.href;
  }, []);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    playUrl
  )}`;
  const largeQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&data=${encodeURIComponent(
    playUrl
  )}`;

  const handleStart = async () => {
    try {
      // Fullscreen requests work best directly inside a click/tap handler.
      await requestAppFullscreen();
    } catch (error) {
      console.warn("Fullscreen request was blocked:", error);
    }

    onStart();
  };

  const openQrFullscreen = async () => {
    setShowQrFullscreen(true);

    try {
      await requestAppFullscreen();
    } catch (error) {
      console.warn("QR fullscreen request was blocked:", error);
    }
  };

  const closeQrFullscreen = async () => {
    setShowQrFullscreen(false);

    try {
      await exitAppFullscreen();
    } catch (error) {
      console.warn("Could not exit fullscreen:", error);
    }
  };

  const handleHostLogin = () => {
    if (hostPassword === HOST_PASSWORD) {
      setPasswordError("");
      setHostPassword("");
      onHost();
      return;
    }

    setPasswordError("Incorrect host password.");
  };

  return (
    <main className="screen screen-start">
      <section className="main-menu">
        <div className="hero-copy">
          <p className="menu-kicker">Decision runner</p>
          <h1>Run a Business</h1>
          <p className="menu-lead">
            Make fast choices, pick your options, and see how a platform turns everyday decisions into long-term pressure.
          </p>

          <div className="menu-actions">
            <button className="primary-button hero-button" onClick={handleStart}>
              Play
            </button>
            <button className="secondary-button hero-button presentation-entry-button" onClick={onPresentation}>
              Presentation Mode
            </button>
          </div>
        </div>

        <div className="hero-qr-card">
          <div className="window-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hero-qr-content">
            <p className="menu-kicker">Scan to join</p>
            <h2>Play on Your Phone</h2>
            <img
              src={qrCodeUrl}
              alt="QR code to play Run a Business"
              width={320}
              height={320}
            />
            <p className="qr-caption">Open the game instantly from the room.</p>
            <p className="tiny-url">{playUrl}</p>
            <button className="secondary-button qr-fullscreen-button" onClick={openQrFullscreen}>
              Fullscreen QR Code
            </button>
          </div>
        </div>

        <div className="menu-lower">
          <div className="how-card menu-how">
            <h2>How to Play</h2>
            <p>
              Your runner moves automatically. Use buttons, swipes, or arrow keys/A/D to choose lanes before each option.
            </p>
            <p>
              Swipe up during a run to briefly fast forward toward the next option.
            </p>
            <p>
              The goal is not just to win. Watch how repeated survival choices shape bigger outcomes.
            </p>
          </div>

          <div className="host-login menu-host">
            <input
              type="password"
              value={hostPassword}
              onChange={(event) => {
                setHostPassword(event.target.value);
                setPasswordError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleHostLogin();
                }
              }}
              placeholder="Host password"
              aria-label="Host password"
            />
            <button className="secondary-button" onClick={handleHostLogin}>
              Host Dashboard
            </button>
            {passwordError && <p className="error-text">{passwordError}</p>}
          </div>
        </div>
      </section>

      <BrandingFooter />

      {showQrFullscreen && (
        <div className="qr-fullscreen" role="dialog" aria-modal="true" aria-label="Fullscreen QR code">
          <button className="qr-close-button" onClick={closeQrFullscreen}>
            Close
          </button>
          <div className="qr-fullscreen-content">
            <p className="menu-kicker">Scan to play</p>
            <h1>Run a Business</h1>
            <img src={largeQrCodeUrl} alt="QR code to play Run a Business" />
            <p>{playUrl}</p>
          </div>
        </div>
      )}
    </main>
  );
}
