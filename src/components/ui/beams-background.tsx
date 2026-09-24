'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Beams Background — adapté de kokonutui.com (@dorianbaffier, MIT), récupéré
 * via 21st.dev (composant source : beams-background-full.txt fourni avec le
 * prompt). Deux écarts par rapport à la démo source, demandés par le prompt :
 *
 * 1. Palette : la teinte HSL colorée (`hue: 190 + Math.random() * 70`, des
 *    bleus/cyans) est retirée au profit d'un dégradé de gris/blanc uniquement
 *    (`rgba(255,255,255,…)` / `rgba(220,220,220,…)`), pour rester dans la
 *    charte noir & blanc du site.
 * 2. Usage : la démo source est une page plein écran avec un grand titre
 *    (« Beams / Background ») ; on ne garde ici que la couche visuelle
 *    (canvas + voile), pensée pour être posée en fond de section
 *    (`absolute inset-0`) via `FondBeams` (`fonds-page.tsx`), sans texte de
 *    démo ni `min-h-screen`.
 *
 * Simplification assumée : la variante du composant source qui bascule
 * teinte/saturation selon une classe `dark` globale (`MutationObserver` sur
 * `document.documentElement`) est retirée — ce site n'a pas de bascule de
 * thème, ce composant n'étant monté QUE sur des sections déjà à fond noir
 * (`bg-encre-950`, voir la répartition du prompt) : une seule palette suffit,
 * pas de détection à maintenir.
 *
 * Pause hors-champ : contrairement à la démo source (boucle
 * `requestAnimationFrame` perpétuelle dès le montage), un `IntersectionObserver`
 * coupe le rendu dès que le canvas quitte le viewport. Nécessaire ici :
 * plusieurs instances peuvent coexister sur une même page (une par section à
 * fond noir), même logique de précaution que celle déjà intégrée dans
 * `ShaderBackground` (Shader 1, fichier fourni tel quel).
 * `prefers-reduced-motion` est géré par l'appelant (`FondBeams`) : ce fichier
 * reste focalisé sur le rendu animé lui-même.
 */

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

const MINIMUM_BEAMS = 20;
const OPACITY_MAP = { subtle: 0.7, medium: 0.85, strong: 1 } as const;

export function BeamsBackground({
  className,
  intensity = 'strong',
}: {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const enVueRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const totalBeams = MINIMUM_BEAMS * 1.5;
      beamsRef.current = Array.from({ length: totalBeams }, () => createBeam(canvas.width, canvas.height));
    };
    updateCanvasSize();

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(canvas);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      const column = index % 3;
      const spacing = canvas!.width / 3;
      beam.y = canvas!.height + 100;
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.opacity = 0.2 + Math.random() * 0.1;
      return beam;
    }

    function drawBeam(context: CanvasRenderingContext2D, beam: Beam) {
      context.save();
      context.translate(beam.x, beam.y);
      context.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * OPACITY_MAP[intensity];

      const gradient = context.createLinearGradient(0, 0, 0, beam.length);
      // Dégradé de gris/blanc — remplace la teinte HSL colorée de la démo source.
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.1, `rgba(255,255,255,${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.4, `rgba(220,220,220,${pulsingOpacity})`);
      gradient.addColorStop(0.6, `rgba(220,220,220,${pulsingOpacity})`);
      gradient.addColorStop(0.9, `rgba(255,255,255,${pulsingOpacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');

      context.fillStyle = gradient;
      context.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      context.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;
      if (!enVueRef.current) {
        animationFrameRef.current = 0;
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'blur(35px)';

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }
        drawBeam(ctx, beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        enVueRef.current = entry.isIntersecting;
        if (entry.isIntersecting && animationFrameRef.current === 0) {
          animate();
        }
      },
      { rootMargin: '200px 0px' },
    );
    intersectionObserver.observe(canvas);

    animate();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [intensity]);

  return (
    <div className={cn('overflow-hidden bg-encre-950', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ filter: 'blur(15px)' }} />
      <motion.div
        className="absolute inset-0 bg-encre-950/5"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }}
        style={{ backdropFilter: 'blur(50px)' }}
      />
    </div>
  );
}
