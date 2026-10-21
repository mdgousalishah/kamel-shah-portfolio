import Hero from './Hero';
import Statement from './Statement';
import About from './About';

export default function HeroAbout() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <Statement />
      <About />
    </div>
  );
}
