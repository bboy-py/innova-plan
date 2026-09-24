'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { TransitionPage } from './TransitionPage';

/**
 * Enveloppe du site public.
 * Deux rôles : décider si l'en-tête et le pied de page sont affichés
 * (l'espace réservé aux ingénieurs s'ouvre sur un écran nu), et héberger
 * la transition entre les routes — qui doit vivre dans un composant
 * persistant, pas dans un template recréé à chaque navigation.
 * L'en-tête et le pied restent des composants serveur, transmis en propriétés.
 */
export function Chrome({
  entete,
  pied,
  children,
}: {
  entete: ReactNode;
  pied: ReactNode;
  children: ReactNode;
}) {
  const chemin = usePathname();
  const espaceReserve = chemin.startsWith('/espace-ingenieurs');

  return (
    <>
      {!espaceReserve && entete}
      <main id="contenu">
        <TransitionPage>{children}</TransitionPage>
      </main>
      {!espaceReserve && pied}
    </>
  );
}
