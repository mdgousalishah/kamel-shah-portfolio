import Hero from './Hero';
import About from './About';

export default function HeroAbout() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <About />
    </div>
  );
}
