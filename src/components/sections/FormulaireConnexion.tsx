'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Bouton } from '@/components/ui/Bouton';
import { ChampFlottant } from '@/components/ui/ChampFlottant';
import { instrument } from '@/lib/motion';

/**
 * Écran de connexion — façade visuelle uniquement.
 * Aucune vérification d'identité n'est effectuée : la soumission affiche un
 * message expliquant que l'authentification sera branchée en phase 2.
 * C'est ici que viendra l'appel au client d'authentification (Supabase).
 */
export function FormulaireConnexion() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [visible, setVisible] = useState(false);
  const [sessionMemorisee, setSessionMemorisee] = useState(true);
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const reduit = useReducedMotion();

  const valideEmail = (v: string) => (/.+@.+\..+/.test(v) ? null : 'Cette adresse semble incomplète.');
  const valideMotDePasse = (v: string) =>
    v.length >= 8 ? null : 'Huit caractères minimum sont attendus.';

  const soumettre = () => {
    if (valideEmail(email) || valideMotDePasse(motDePasse)) {
      setMessage('Vérifiez les deux champs avant de continuer.');
      return;
    }
    setMessage(null);
    setEnCours(true);
    // PHASE 2 : appel réel d'authentification, puis redirection vers le tableau de bord.
    window.setTimeout(() => {
      setEnCours(false);
      setMessage(
        'Interface de démonstration : l\u2019authentification sera activée lors du branchement du back-office.',
      );
    }, 900);
  };

  return (
    <div className="w-full max-w-md">
      <p className="font-display text-rail font-bold uppercase text-encre-500">
        Espace réservé aux ingénieurs Innova Plan
      </p>
      <h1 className="mt-5 font-display text-display-m font-extrabold text-encre-950">Connexion</h1>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-encre-700">
        Accès aux dossiers d&apos;études, aux comptes rendus de chantier et aux maquettes en cours.
        Réservé aux associés et collaborateurs habilités.
      </p>

      <div className="mt-10 space-y-8">
        <ChampFlottant
          label="Adresse e-mail professionnelle"
          type="email"
          valeur={email}
          onChange={setEmail}
          valider={valideEmail}
          autoComplete="email"
          requis
        />

        <div className="relative">
          <ChampFlottant
            label="Mot de passe"
            type={visible ? 'text' : 'password'}
            valeur={motDePasse}
            onChange={setMotDePasse}
            valider={valideMotDePasse}
            autoComplete="current-password"
            requis
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute -top-1 right-0 font-display text-rail font-bold uppercase text-encre-500 transition-colors hover:text-encre-950"
          >
            {visible ? 'Masquer' : 'Afficher'}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            role="switch"
            aria-checked={sessionMemorisee}
            onClick={() => setSessionMemorisee((v) => !v)}
            className="flex items-center gap-3 text-sm text-encre-700"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center border transition-colors duration-300 ${
                sessionMemorisee ? 'border-sarcelle-600 bg-sarcelle-600' : 'border-black/25'
              }`}
              aria-hidden
            >
              {sessionMemorisee && (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M2 8.5l4 4 8-9" />
                </svg>
              )}
            </span>
            Rester connecté sur cet appareil
          </button>

          <Link
            href="/contact"
            className="border-b border-sarcelle-600 pb-0.5 text-sm font-medium text-encre-950 transition-colors hover:text-encre-600"
          >
            Mot de passe oublié
          </Link>
        </div>

        <Bouton onClick={soumettre} chargement={enCours} className="w-full">
          Se connecter
        </Bouton>

        {message && (
          <motion.p
            role="status"
            initial={reduit ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: instrument }}
            className="border-l-2 border-alerte bg-alerte-fond px-4 py-3 text-sm leading-relaxed text-encre-700"
          >
            {message}
          </motion.p>
        )}
      </div>

      <p className="mt-10 border-t border-black/10 pt-6 text-sm text-encre-500">
        Pas encore d&apos;accès ? Les comptes sont créés par la direction des études.{' '}
        <Link href="/contact" className="text-encre-950 underline underline-offset-4">
          Contacter le bureau
        </Link>
      </p>
    </div>
  );
}
