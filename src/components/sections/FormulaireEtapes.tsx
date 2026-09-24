'use client';

import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bouton } from '@/components/ui/Bouton';
import { ChampFlottant } from '@/components/ui/ChampFlottant';
import { instrument } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Formulaire de demande en plusieurs étapes.
 * Phase 1 : aucune donnée n'est transmise et aucun fichier n'est téléversé —
 * l'envoi est simulé, temporisation comprise, pour que l'état de chargement
 * du bouton soit réellement visible. Point d'accroche de la phase 2 :
 * la fonction `envoyer()`.
 */
type TypeProjet = 'Résidentiel' | 'Commercial' | 'Infrastructure' | 'Audit technique';

interface Donnees {
  typeProjet: TypeProjet | null;
  nom: string;
  email: string;
  telephone: string;
  localisation: string;
  message: string;
  fichier: string | null;
}

const vide: Donnees = {
  typeProjet: null,
  nom: '',
  email: '',
  telephone: '',
  localisation: '',
  message: '',
  fichier: null,
};

const typesProjet: TypeProjet[] = ['Résidentiel', 'Commercial', 'Infrastructure', 'Audit technique'];

// Règles de validation partagées entre le contrôle temps réel et le passage à l'étape suivante
const regles = {
  nom: (v: string) => (v.trim().length > 1 ? null : 'Indiquez votre nom.'),
  email: (v: string) => (/.+@.+\..+/.test(v) ? null : 'Cette adresse semble incomplète.'),
  telephone: (v: string) =>
    v.length === 0 || v.replace(/\D/g, '').length >= 8 ? null : 'Le numéro paraît trop court.',
  localisation: (v: string) =>
    v.trim().length > 1 ? null : 'Indiquez au moins la ville ou le quartier.',
  message: (v: string) =>
    v.trim().length > 9 ? null : 'Quelques mots de plus nous aideront à répondre utilement.',
};

export function FormulaireEtapes() {
  const [etape, setEtape] = useState(0);
  const [donnees, setDonnees] = useState<Donnees>(vide);
  const [enCours, setEnCours] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const champFichier = useRef<HTMLInputElement>(null);
  const reduit = useReducedMotion();

  const maj = <C extends keyof Donnees>(cle: C, valeur: Donnees[C]) => {
    setDonnees((d) => ({ ...d, [cle]: valeur }));
    setErreur(null);
  };

  const etapes = useMemo(
    () => [
      {
        repere: '01',
        question: 'Quel type de projet souhaitez-vous nous confier ?',
        valide: () => (donnees.typeProjet ? null : 'Choisissez un type de projet pour continuer.'),
      },
      { repere: '02', question: 'Comment vous appelez-vous ?', valide: () => regles.nom(donnees.nom) },
      {
        repere: '03',
        question: 'Où pouvons-nous vous joindre ?',
        valide: () => regles.email(donnees.email) ?? regles.telephone(donnees.telephone),
      },
      {
        repere: '04',
        question: 'Où se situe le terrain ou l\u2019ouvrage ?',
        valide: () => regles.localisation(donnees.localisation),
      },
      {
        repere: '05',
        question: 'Décrivez le projet en quelques lignes.',
        valide: () => regles.message(donnees.message),
      },
    ],
    [donnees],
  );

  const derniere = etape === etapes.length - 1;
  const progression = Math.round(((etape + (envoye ? 1 : 0)) / etapes.length) * 100);

  const envoyer = () => {
    setEnCours(true);
    // PHASE 2 : remplacer par un POST vers /api/contact (et le téléversement réel du fichier).
    window.setTimeout(() => {
      setEnCours(false);
      setEnvoye(true);
    }, 900);
  };

  const suivant = () => {
    const probleme = etapes[etape].valide();
    if (probleme) return setErreur(probleme);
    if (derniere) return envoyer();
    setEtape((e) => e + 1);
  };

  if (envoye) {
    return (
      <div className="border border-black/15 bg-white p-8 sm:p-12">
        <p className="font-display text-rail font-bold uppercase text-encre-500">Demande enregistrée</p>
        <h3 className="mt-5 max-w-[22ch] font-display text-display-s font-extrabold text-encre-950">
          Merci {donnees.nom.split(' ')[0]}, nous revenons vers vous sous 48 heures.
        </h3>
        <p className="mt-5 max-w-prose leading-relaxed text-encre-700">
          Un ingénieur associé examine votre demande et vous répond avec un premier avis technique.
          Pour un sujet urgent, appelez directement le bureau.
        </p>
        <dl className="mt-8 grid gap-4 border-t border-black/10 pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-encre-500">Type de projet</dt>
            <dd className="font-display text-sm font-bold text-encre-950">{donnees.typeProjet}</dd>
          </div>
          <div>
            <dt className="text-xs text-encre-500">Localisation</dt>
            <dd className="font-display text-sm font-bold text-encre-950">{donnees.localisation}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => {
            setDonnees(vide);
            setEtape(0);
            setEnvoye(false);
          }}
          className="mt-8 border-b border-sarcelle-600 pb-1 font-display text-sm font-bold text-encre-950 hover:text-encre-600"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <div className="border border-black/15 bg-white">
      {/* Progression : un pourcentage, comme sur un avancement de chantier */}
      <div className="flex items-center justify-between gap-6 border-b border-black/10 px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          {etapes.map((e, i) => (
            <span
              key={e.repere}
              className={cn(
                'chiffre-tabulaire font-display text-rail font-bold transition-colors duration-300',
                i === etape ? 'text-sarcelle-700' : i < etape ? 'text-encre-950' : 'text-encre-500/50',
              )}
            >
              {e.repere}
            </span>
          ))}
        </div>
        <span className="chiffre-tabulaire font-display text-rail font-bold text-encre-500">
          {progression}%
        </span>
      </div>
      <div className="h-px w-full bg-black/10">
        <motion.div
          animate={{ width: `${progression}%` }}
          transition={{ duration: reduit ? 0 : 0.5, ease: instrument }}
          className="h-px bg-sarcelle-600"
        />
      </div>

      <div className="px-6 py-10 sm:px-10 sm:py-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={etape}
            initial={reduit ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduit ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: instrument }}
          >
            <h3 className="max-w-[24ch] font-display text-display-s font-extrabold text-encre-950">
              {etapes[etape].question}
            </h3>

            <div className="mt-8">
              {etape === 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {typesProjet.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => maj('typeProjet', type)}
                      aria-pressed={donnees.typeProjet === type}
                      className={cn(
                        'border px-5 py-5 text-left font-display text-base font-bold transition-all duration-300 ease-instrument',
                        donnees.typeProjet === type
                          ? 'border-sarcelle-600 bg-sarcelle-600 text-white'
                          : 'border-black/20 text-encre-950 hover:border-encre-950',
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}

              {etape === 1 && (
                <ChampFlottant
                  label="Nom et prénom"
                  valeur={donnees.nom}
                  onChange={(v) => maj('nom', v)}
                  valider={regles.nom}
                  autoComplete="name"
                  requis
                />
              )}

              {etape === 2 && (
                <div className="grid gap-8 sm:grid-cols-2">
                  <ChampFlottant
                    label="Adresse e-mail"
                    type="email"
                    valeur={donnees.email}
                    onChange={(v) => maj('email', v)}
                    valider={regles.email}
                    autoComplete="email"
                    requis
                  />
                  <ChampFlottant
                    label="Téléphone"
                    type="tel"
                    valeur={donnees.telephone}
                    onChange={(v) => maj('telephone', v)}
                    valider={regles.telephone}
                    autoComplete="tel"
                    indication="Facultatif, mais utile pour les sujets urgents."
                  />
                </div>
              )}

              {etape === 3 && (
                <ChampFlottant
                  label="Ville, quartier ou coordonnées du site"
                  valeur={donnees.localisation}
                  onChange={(v) => maj('localisation', v)}
                  valider={regles.localisation}
                  requis
                />
              )}

              {etape === 4 && (
                <div className="space-y-8">
                  <ChampFlottant
                    label="Votre projet"
                    valeur={donnees.message}
                    onChange={(v) => maj('message', v)}
                    valider={regles.message}
                    multiligne
                    indication="Surface, nombre de niveaux, échéance souhaitée, contraintes connues…"
                    requis
                  />

                  {/* Pièce jointe : la sélection est mémorisée, le téléversement viendra en phase 2 */}
                  <div>
                    <span className="font-display text-rail font-bold uppercase text-encre-950">
                      Plan ou document (PDF, facultatif)
                    </span>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => champFichier.current?.click()}
                        className="border border-black/20 px-5 py-3 font-display text-sm font-bold text-encre-950 transition-colors hover:border-encre-950"
                      >
                        Choisir un fichier
                      </button>
                      <span className="text-sm text-encre-500">
                        {donnees.fichier ?? 'Aucun fichier sélectionné'}
                      </span>
                    </div>
                    <input
                      ref={champFichier}
                      type="file"
                      accept=".pdf,.dwg,.jpg,.png"
                      className="sr-only"
                      onChange={(e) => maj('fichier', e.target.files?.[0]?.name ?? null)}
                    />
                  </div>
                </div>
              )}
            </div>

            {erreur && (
              <p role="alert" className="mt-5 text-sm text-alerte">
                {erreur}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between gap-6 border-t border-black/10 pt-8">
          <button
            type="button"
            onClick={() => setEtape((e) => Math.max(0, e - 1))}
            disabled={etape === 0 || enCours}
            className="font-display text-sm font-bold text-encre-500 transition-colors hover:text-encre-950 disabled:opacity-40 disabled:hover:text-encre-500"
          >
            Étape précédente
          </button>
          <Bouton onClick={suivant} chargement={enCours}>
            {derniere ? 'Envoyer la demande' : 'Continuer'}
          </Bouton>
        </div>
      </div>
    </div>
  );
}
