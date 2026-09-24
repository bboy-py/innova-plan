'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Champ de formulaire à libellé flottant.
 * Le libellé sert de placeholder tant que le champ est vide, puis remonte
 * au-dessus de la saisie — il reste donc lisible pendant la frappe, ce qu'un
 * simple placeholder ne permet pas.
 *
 * Validation : elle ne se déclenche qu'après la première sortie du champ
 * (pas pendant la frappe initiale, où tout message serait prématuré), puis
 * en temps réel. Le signalement est un filet ambre et un message sous le champ,
 * jamais un cadre rouge.
 */
export function ChampFlottant({
  label,
  valeur,
  onChange,
  type = 'text',
  valider,
  autoComplete,
  indication,
  multiligne = false,
  requis = false,
}: {
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  type?: string;
  /** Renvoie un message d'erreur, ou null si la saisie est acceptable. */
  valider?: (v: string) => string | null;
  autoComplete?: string;
  indication?: string;
  multiligne?: boolean;
  requis?: boolean;
}) {
  const id = useId();
  const [focus, setFocus] = useState(false);
  const [touche, setTouche] = useState(false);
  const reduit = useReducedMotion();

  const erreur = touche && valider ? valider(valeur) : null;
  const valide = touche && valider ? valider(valeur) === null && valeur.length > 0 : false;
  const remonte = focus || valeur.length > 0;

  const communs = {
    id,
    value: valeur,
    autoComplete,
    'aria-invalid': Boolean(erreur),
    'aria-describedby': erreur ? `${id}-message` : indication ? `${id}-aide` : undefined,
    required: requis,
    onFocus: () => setFocus(true),
    onBlur: () => {
      setFocus(false);
      setTouche(true);
    },
    className: cn(
      // Le contour de focus est conservé : un simple changement de couleur de
      // filet ne suffit pas à signaler la position du clavier.
      'peer w-full border-b bg-transparent pb-3 pt-6 font-display text-lg font-semibold text-encre-950 transition-colors duration-300',
      'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sarcelle-600',
      erreur ? 'border-alerte' : valide ? 'border-sarcelle-600' : 'border-black/25 focus:border-sarcelle-600',
    ),
  };

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-0 origin-left font-display transition-all duration-300 ease-instrument',
          remonte
            ? 'top-0 text-rail font-bold uppercase text-encre-950'
            : 'top-6 text-lg font-normal text-encre-500',
        )}
      >
        {label}
      </label>

      {multiligne ? (
        <textarea
          {...communs}
          rows={5}
          onChange={(e) => onChange(e.target.value)}
          className={cn(communs.className, 'resize-none leading-relaxed')}
        />
      ) : (
        <input {...communs} type={type} onChange={(e) => onChange(e.target.value)} />
      )}

      {/* Coche discrète quand la saisie est acceptée */}
      <AnimatePresence>
        {valide && (
          <motion.span
            initial={reduit ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden
            className="absolute bottom-4 right-0 text-sarcelle-600"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 8.5l4 4 8-9" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {erreur && (
          <motion.p
            id={`${id}-message`}
            role="alert"
            initial={reduit ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2 text-sm text-alerte"
          >
            {erreur}
          </motion.p>
        )}
      </AnimatePresence>

      {!erreur && indication && (
        <p id={`${id}-aide`} className="mt-2 text-sm text-encre-500">
          {indication}
        </p>
      )}
    </div>
  );
}
