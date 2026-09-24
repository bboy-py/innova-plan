"use client";

/**
 * Liquid Metal Button — 21st.dev (@johuniq), source récupérée sur
 * jolyui.dev/docs/components/buttons/liquid-metal-button (MIT), copiée ici
 * telle quelle pour la partie `LiquidMetalButton` autonome (usage de
 * référence du Prompt G : bouton isolé taille fixe, label unique).
 *
 * Le site n'utilise cependant jamais ce composant autonome directement : ses
 * boutons (<Bouton>) doivent conserver leur largeur variable (texte de
 * longueur libre), leur navigation (`<Link>`/`<button type="submit">`), leur
 * icône dédiée et leur état de chargement — autant de choses que la version
 * source, pensée pour une démo à deux tailles fixes, ne gère pas. `<Bouton>`
 * a donc besoin du rendu fond/bordure/reflet metal isolé de son contenu :
 * `LiquidMetalSurface`, plus bas, est cette extraction — même mécanisme de
 * shader (`@paper-design/shaders`, mêmes uniforms `u_*`), mais en couche de
 * fond `absolute inset-0` sans texte ni <button> propre, pilotée par les
 * états survol/pression du bouton hôte plutôt que par ses propres gestion-
 * naires de souris (elle ne peut pas en avoir : elle est `pointer-events:
 * none` pour laisser les clics passer au véritable élément interactif posé
 * au-dessus).
 *
 * Adaptation de teinte : la charte du site est noir & blanc éditorial
 * (voir README). Les décalages chromatiques du shader (`u_shiftRed`,
 * `u_shiftBlue`, valeur d'origine 0.3 chacun) ont été réduits à 0.12 pour
 * limiter les reflets teintés et rester dans un rendu argenté/gris
 * métallique cohérent avec le reste de la direction éditoriale, plutôt que
 * de garder un liquid metal irisé qui jurerait avec elle.
 */

import { Sparkles } from "lucide-react";
import type React from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
}

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: External library without types
  const shaderMount = useRef<any>(null);
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
      return {
        width: 142,
        height: 46,
        innerWidth: 138,
        innerHeight: 42,
        shaderWidth: 142,
        shaderHeight: 46,
      };
    }
  }, [viewMode]);

  useEffect(() => {
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
              u_shiftRed: 0.12,
              u_shiftBlue: 0.12,
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
          );
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
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
            transition:
              "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
            transform: "none",
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
                  color: "#666666",
                  filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))",
                  transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: "scale(1)",
                }}
              />
            )}
            {viewMode === "text" && (
              <span
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  fontWeight: 400,
                  textShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)",
                  transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: "scale(1)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
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
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
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
                background: "linear-gradient(180deg, #202020 0%, #000000 100%)",
                boxShadow: isPressed
                  ? "inset 0px 2px 4px rgba(0, 0, 0, 0.4), inset 0px 1px 2px rgba(0, 0, 0, 0.3)"
                  : "none",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
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
              outline: "none",
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

/* ------------------------------------------------------------------------ *
 * LiquidMetalSurface — adaptation pour <Bouton>, cf. commentaire d'en-tête.
 * ------------------------------------------------------------------------ */

export interface LiquidMetalSurfaceHandle {
  /** Lance un ricochet lumineux au point de clic (repris de la démo source). */
  triggerRipple: (x: number, y: number) => void;
}

interface LiquidMetalSurfaceProps {
  /** Reflète l'état de survol du bouton hôte (piloté depuis <Bouton>). */
  hovered?: boolean;
  /** Reflète l'état de pression (mousedown) du bouton hôte. */
  pressed?: boolean;
  /** `useReducedMotion()` du bouton hôte : coupe le shader animé. */
  reduceMotion?: boolean;
  className?: string;
}

export const LiquidMetalSurface = forwardRef<
  LiquidMetalSurfaceHandle,
  LiquidMetalSurfaceProps
>(({ hovered = false, pressed = false, reduceMotion = false, className }, ref) => {
  const shaderRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: bibliothèque externe sans types
  const shaderMount = useRef<any>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>(
    []
  );
  const rippleId = useRef(0);

  useImperativeHandle(ref, () => ({
    triggerRipple: (x: number, y: number) => {
      if (reduceMotion) return;
      const ripple = { x, y, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      if (shaderMount.current?.setSpeed) {
        shaderMount.current.setSpeed(2.4);
        setTimeout(() => {
          shaderMount.current?.setSpeed?.(hovered ? 1 : 0.6);
        }, 300);
      }
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    },
  }));

  // Même feuille de style globale que le composant source (canvas responsive,
  // keyframes du ricochet) — partagée si `LiquidMetalButton` est également
  // monté sur la page, injectée une seule fois.
  useEffect(() => {
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
        }
        @keyframes ripple-animation {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    // `prefers-reduced-motion` : le shader (animé en permanence, même au
    // repos, `u_speed` de base 0.6) n'est jamais monté — repli en dégradé
    // statique ci-dessous, cohérent avec le reste du site qui neutralise
    // toute animation JS/canvas plutôt que de simplement la ralentir.
    if (reduceMotion) return;

    const loadShader = async () => {
      try {
        const { liquidMetalFragmentShader, ShaderMount } = await import(
          "@paper-design/shaders"
        );

        if (shaderRef.current) {
          shaderMount.current = new ShaderMount(
            shaderRef.current,
            liquidMetalFragmentShader,
            {
              u_repetition: 4,
              u_softness: 0.5,
              u_shiftRed: 0.12,
              u_shiftBlue: 0.12,
              u_distortion: 0,
              u_contour: 0,
              u_angle: 45,
              u_scale: 8,
              u_shape: 1,
              u_offsetX: 0.1,
              u_offsetY: -0.1,
            },
            undefined,
            0.6
          );
        }
      } catch (error) {
        console.error("Liquid metal — échec du chargement du shader :", error);
      }
    };

    loadShader();

    return () => {
      shaderMount.current?.destroy?.();
      shaderMount.current = null;
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    shaderMount.current?.setSpeed?.(hovered ? 1 : 0.6);
  }, [hovered, reduceMotion]);

  return (
    <span
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "9999px",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        boxShadow: pressed
          ? "inset 0px 2px 4px rgba(0,0,0,0.4), 0px 0px 0px 1px rgba(0,0,0,0.5)"
          : hovered
            ? "0px 0px 0px 1px rgba(0,0,0,0.4), 0px 8px 5px 0px rgba(0,0,0,0.1), 0px 4px 4px 0px rgba(0,0,0,0.15)"
            : "0px 0px 0px 1px rgba(0,0,0,0.3), 0px 9px 9px 0px rgba(0,0,0,0.12)",
        transition:
          "box-shadow 0.3s cubic-bezier(0.34,1.56,0.64,1), transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: pressed ? "scale(0.98)" : "scale(1)",
      }}
    >
      {reduceMotion ? (
        // État statique équivalent : même dégradé de base que le shader au
        // repos (gris anthracite → noir), sans animation.
        <span
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, #2a2a2a 0%, #050505 100%)",
          }}
        />
      ) : (
        <div
          ref={shaderRef}
          className="shader-container-exploded"
          style={{ position: "absolute", inset: 0 }}
        />
      )}
      {!reduceMotion &&
        ripples.map((ripple) => (
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
                "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
              animation: "ripple-animation 0.6s ease-out",
            }}
          />
        ))}
    </span>
  );
});

LiquidMetalSurface.displayName = "LiquidMetalSurface";
