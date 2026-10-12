"use client";

import { Sparkles } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

// Source: https://21st.dev/r/johuniq/liquid-metal-button
// (fetched manually — the shadcn registry endpoint now requires authentication)

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
  /** Icon lucide di kiri label (hanya untuk viewMode "text"). */
  icon?: React.ReactNode;
  /** "light" = white plate with black text, "metal" = dark liquid-metal face, "ghost" = plate transparan tanpa isian. */
  variant?: "metal" | "light" | "ghost";
  /** Override the label colour (defaults depend on the variant). */
  labelColor?: string;
  /** Override the label font weight (default 400). */
  labelWeight?: number;
}

type ShaderHandle = {
  destroy?: () => void;
  setSpeed?: (speed: number) => void;
};

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
  icon,
  variant = "metal",
  labelColor,
  labelWeight,
}: LiquidMetalButtonProps) {
  const isLight = variant === "light";
  const isGhost = variant === "ghost";
  const textColor = labelColor ?? (isGhost ? "#f4f4f5" : isLight ? "#08080a" : "#666666");
  const textWeight = labelWeight ?? 400;
  const textShadow = isGhost
    ? "none"
    : isLight
      ? "0px 1px 2px rgba(0, 0, 0, 0.12)"
      : "0px 1px 2px rgba(0, 0, 0, 0.5)";
  const iconShadow = isGhost
    ? "none"
    : isLight
      ? "drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.18))"
      : "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))";
  const hoverTextColor = isGhost || !isLight ? "#67e8f9" : "#000000";
  const plateBackground = isGhost
    ? "transparent"
    : isLight
      ? "linear-gradient(180deg, #ffffff 0%, #e8e8ee 100%)"
      : "linear-gradient(180deg, #202020 0%, #000000 100%)";
  const plateHoverBackground = isGhost
    ? "rgba(255, 255, 255, 0.07)"
    : isLight
      ? "linear-gradient(180deg, #f3feff 0%, #d6f4fb 100%)"
      : "linear-gradient(180deg, #2f3a3f 0%, #05080b 100%)";

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  /**
   * Shader di-arm saat interaksi pertama (hover/focus/klik), bukan saat
   * mount — chunk @paper-design/shaders tidak ikut initial page load;
   * plate gradient statis tampil sampai shader siap.
   */
  const [shaderArmed, setShaderArmed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<ShaderHandle | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const dimensions = useMemo(() => {
    if (viewMode === "icon") {
      return {
        width: 46,
        height: 46,
        innerWidth: 42,
        innerHeight: 42,
        shaderWidth: 46,
        shaderHeight: 46,
      };
    } else {
      // Icon + label butuh lebar ekstra, kalau tidak label terpotong.
      const width = 142 + (icon ? 30 : 0);
      return {
        width,
        height: 46,
        innerWidth: width - 4,
        innerHeight: 42,
        shaderWidth: width,
        shaderHeight: 46,
      };
    }
  }, [viewMode, icon]);

  useEffect(() => {
    // Variant ghost: plate transparan, shader logam tidak dipakai.
    // Non-ghost: tunggu interaksi pertama (shaderArmed) sebelum dynamic
    // import — halaman load tanpa mengambil chunk shader.
    if (isGhost || !shaderArmed) return;

    const styleId = "shader-canvas-style-exploded";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const loadShader = async () => {
      try {
        const { liquidMetalFragmentShader, ShaderMount } = await import(
          "@paper-design/shaders"
        );

        if (shaderRef.current) {
          if (shaderMount.current?.destroy) {
            shaderMount.current.destroy();
          }

          shaderMount.current = new ShaderMount(
            shaderRef.current,
            liquidMetalFragmentShader,
            {
              u_repetition: 4,
              u_softness: 0.5,
              u_shiftRed: 0.3,
              u_shiftBlue: 0.3,
              u_distortion: 0,
              u_contour: 0,
              u_angle: 45,
              u_scale: 8,
              u_shape: 1,
              u_offsetX: 0.1,
              u_offsetY: -0.1,
            },
            undefined,
            0.6,
          ) as ShaderHandle;
        }
      } catch (error) {
        console.error("[v0] Failed to load shader:", error);
      }
    };

    loadShader();

    return () => {
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, [isGhost, shaderArmed]);

  const handleMouseEnter = () => {
    setShaderArmed(true);
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShaderArmed(true);

    if (shaderMount.current?.setSpeed) {
      shaderMount.current.setSpeed(2.4);
      setTimeout(() => {
        if (isHovered) {
          shaderMount.current?.setSpeed?.(1);
        } else {
          shaderMount.current?.setSpeed?.(0.6);
        }
      }, 300);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };

      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  };

  return (
    <div className="relative inline-block">
      <div
        style={{
          perspective: "1000px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "relative",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformStyle: "preserve-3d",
            transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
            transform: isHovered ? "scale(1.05)" : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, gap 0.4s ease",
              transform: "translateZ(20px)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            {viewMode === "icon" && (
              <Sparkles
                size={16}
                style={{
                  color: textColor,
                  filter: iconShadow,
                  transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: isHovered ? "scale(1.18) rotate(14deg)" : "scale(1)",
                }}
              />
            )}
            {viewMode === "text" && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {icon ? (
                  <span
                    style={{
                      display: "inline-flex",
                      color: isHovered ? hoverTextColor : textColor,
                      filter: iconShadow,
                      transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transform: isHovered ? "scale(1.18) rotate(-10deg)" : "scale(1)",
                    }}
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                ) : null}
                <span
                  style={{
                    fontSize: "14px",
                    color: isHovered ? hoverTextColor : textColor,
                    fontWeight: textWeight,
                    letterSpacing: isHovered ? "0.05em" : "0em",
                    textShadow: textShadow,
                    transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: isHovered ? "translateY(-1px) scale(1.06)" : "scale(1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </span>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              transform: `translateZ(10px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: `${dimensions.innerWidth}px`,
                height: `${dimensions.innerHeight}px`,
                margin: "2px",
                borderRadius: "100px",
                border: isGhost
                  ? `1px solid ${isHovered ? "rgba(103, 232, 249, 0.55)" : "rgba(255, 255, 255, 0.16)"}`
                  : "none",
                background: isHovered ? plateHoverBackground : plateBackground,
                boxShadow: isPressed
                  ? "inset 0px 2px 4px rgba(0, 0, 0, 0.4), inset 0px 1px 2px rgba(0, 0, 0, 0.3)"
                  : "none",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            {/* light sweep that runs across the plate while hovered */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "2px",
                borderRadius: "100px",
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-40%",
                  left: 0,
                  width: "38%",
                  height: "180%",
                  background: isLight
                    ? "linear-gradient(100deg, transparent 0%, rgba(103, 232, 249, 0.65) 50%, transparent 100%)"
                    : "linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.55) 50%, transparent 100%)",
                  transform: isHovered
                    ? "translateX(430%) skewX(-14deg)"
                    : "translateX(-170%) skewX(-14deg)",
                  opacity: isHovered ? 1 : 0,
                  transition: "transform .95s cubic-bezier(0.4, 0, 0.2, 1), opacity .3s ease",
                }}
              />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              transform: `translateZ(0px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
              zIndex: 10,
            }}
          >
            <div
              style={{
                height: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                borderRadius: "100px",
                boxShadow: isPressed
                  ? "0px 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)"
                  : isHovered
                    ? "0px 0px 0px 1px rgba(0, 0, 0, 0.4), 0px 12px 6px 0px rgba(0, 0, 0, 0.05), 0px 8px 5px 0px rgba(0, 0, 0, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)"
                    : "0px 0px 0px 1px rgba(0, 0, 0, 0.3), 0px 36px 14px 0px rgba(0, 0, 0, 0.02), 0px 20px 12px 0px rgba(0, 0, 0, 0.08), 0px 9px 9px 0px rgba(0, 0, 0, 0.12), 0px 2px 5px 0px rgba(0, 0, 0, 0.15)",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "rgb(0 0 0 / 0)",
              }}
            >
              <div
                ref={shaderRef}
                className="shader-container-exploded"
                style={{
                  borderRadius: "100px",
                  overflow: "hidden",
                  position: "relative",
                  width: `${dimensions.shaderWidth}px`,
                  maxWidth: `${dimensions.shaderWidth}px`,
                  height: `${dimensions.shaderHeight}px`,
                  transition: "width 0.4s ease, height 0.4s ease",
                }}
              />
            </div>
          </div>

          <button
            ref={buttonRef}
            onClick={handleClick}
            onFocus={() => setShaderArmed(true)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              zIndex: 40,
              transformStyle: "preserve-3d",
              transform: "translateZ(25px)",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              overflow: "hidden",
              borderRadius: "100px",
            }}
            aria-label={label}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                style={{
                  position: "absolute",
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)",
                  pointerEvents: "none",
                  animation: "ripple-animation 0.6s ease-out",
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}
