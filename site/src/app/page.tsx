import { About } from '@/components/About';
import { Boot } from '@/components/Boot';
import { BuildLog } from '@/components/BuildLog';
import { Contact } from '@/components/Contact';
import { Flagship } from '@/components/flagship/Flagship';
import { Footer } from '@/components/Footer';
import { GitLog } from '@/components/GitLog';
import { Hero } from '@/components/hero/Hero';
import { Research } from '@/components/Research';
import { SectionRail } from '@/components/SectionRail';
import { Stack } from '@/components/Stack';
import { Systems } from '@/components/systems/Systems';
import { Terminal } from '@/components/Terminal';

export default function Home() {
  return (
    <>
      <Boot />
      <SectionRail />
      <main id="main">
        <Hero />
        <About />
        <Flagship />
        <Systems />
        <GitLog />
        <Research />
        <Stack />
        <BuildLog />
        <Terminal />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
