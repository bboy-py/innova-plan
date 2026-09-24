import { Hero } from '@/components/sections/Hero';
import { Presentation } from '@/components/sections/Presentation';
import { ProjetsALaUne } from '@/components/sections/ProjetsALaUne';
import { ChiffresCles } from '@/components/sections/ChiffresCles';
import { Temoignages } from '@/components/sections/Temoignages';
import { Partenaires } from '@/components/sections/Partenaires';
import { Questions } from '@/components/sections/Questions';
import { AppelAction } from '@/components/sections/AppelAction';

export default function Accueil() {
  return (
    <>
      <Hero />
      <Presentation />
      <ProjetsALaUne />
      <ChiffresCles />
      <Temoignages />
      <Partenaires />
      <Questions />
      <AppelAction variante="principale" />
    </>
  );
}
