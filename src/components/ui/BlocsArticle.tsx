import type { BlocArticle } from '@/types';
import { ImageHover } from '@/components/ui/image-reveal';

/**
 * Rendu du corps d'article à partir des blocs de données.
 * La largeur de lecture est limitée à ~68 caractères ; les images et les
 * encadrés débordent légèrement de la colonne de texte sur grand écran
 * pour rythmer la lecture.
 */
export function BlocsArticle({ blocs }: { blocs: BlocArticle[] }) {
  return (
    <div className="space-y-7">
      {blocs.map((bloc, i) => {
        switch (bloc.type) {
          case 'intertitre':
            return (
              <h2
                key={bloc.id}
                id={bloc.id}
                className="scroll-mt-32 pt-8 font-display text-display-s font-extrabold text-encre-950"
              >
                {bloc.texte}
              </h2>
            );

          case 'paragraphe':
            return (
              <p key={i} className="text-[1.0625rem] font-light leading-[1.75] text-encre-700">
                {bloc.texte}
              </p>
            );

          case 'liste':
            return (
              <ul key={i} className="space-y-3 border-l border-sarcelle-600/40 pl-6">
                {bloc.items.map((item) => (
                  <li key={item.slice(0, 20)} className="text-[1.0625rem] font-light leading-[1.7] text-encre-700">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case 'citation':
            return (
              <blockquote key={i} className="border-l-2 border-sarcelle-600 py-1 pl-6">
                <p className="text-lg font-light italic leading-relaxed text-encre-950">« {bloc.texte} »</p>
                {bloc.source && <cite className="mt-3 block text-sm not-italic text-encre-500">{bloc.source}</cite>}
              </blockquote>
            );

          case 'image':
            return (
              <figure key={i} className="py-4 lg:-mx-16">
                <ImageHover
                  src={bloc.src}
                  alt={bloc.alt}
                  className="aspect-[16/9] w-full"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
                <figcaption className="mt-3 text-sm leading-relaxed text-encre-500">
                  {bloc.legende}
                </figcaption>
              </figure>
            );

          case 'encadre':
            return (
              <aside key={i} className="cartouche my-4 border border-black/15 bg-white p-7 text-encre-950">
                <p className="font-display text-rail font-bold uppercase text-sarcelle-700">{bloc.titre}</p>
                <p className="mt-4 text-[1.0625rem] font-light leading-[1.7] text-encre-700">{bloc.texte}</p>
              </aside>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
