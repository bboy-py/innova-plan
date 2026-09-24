'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Image de fond animée en parallaxe douce (l'image se déplace un peu moins
 * vite que la page). Amplitude volontairement faible pour ne pas donner
 * l'impression que le contenu flotte.
 */
export function ImageParallax({
  src,
  alt,
  amplitude = 12,
  className,
  priority = false,
  sizes = '100vw',
}: {
  src: string;
  alt: string;
  amplitude?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const conteneur = useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();
  // La parallaxe reste réservée aux grands écrans : sur mobile elle coûte des
  // recalculs de mise en page pour un effet à peine perceptible.
  const [grandEcran, setGrandEcran] = useState(false);

  useEffect(() => {
    const requete = window.matchMedia('(min-width: 1024px)');
    const appliquer = () => setGrandEcran(requete.matches);
    appliquer();
    requete.addEventListener('change', appliquer);
    return () => requete.removeEventListener('change', appliquer);
  }, []);
  const { scrollYProgress } = useScroll({
    target: conteneur,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amplitude}%`, `${amplitude}%`]);

  const anime = grandEcran && !reduit;

  return (
    <div ref={conteneur} className={cn('relative overflow-hidden', className)}>
      <motion.div
        style={anime ? { y } : undefined}
        className={anime ? 'absolute inset-0 -top-[15%] h-[130%]' : 'absolute inset-0'}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </div>
  );
}
