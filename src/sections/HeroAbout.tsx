import CinematicScroll from '../components/cinematic/CinematicScroll';
import IdentityPhilosophy from './IdentityPhilosophy';

export default function HeroAbout() {
  return (
    <div className="w-full bg-[#08080A] flex flex-col relative text-[#F3F4F6]">
      {/* =====================================================================
          1. CINEMATIC SCROLL-DRIVEN SCENE TIMELINE (5 SCENES + ORGANIC TORN SHADER)
          Scene 01: Identity & Vision
          Scene 02: Agentic AI & Neural Systems
          Scene 03: Full-Stack Architecture
          Scene 04: 3D Orbital Project Solar System
          Scene 05: Experience & Collaboration Nexus ("LET'S BUILD SOMETHING INTELLIGENT.")
          ===================================================================== */}
      <section id="home" className="relative w-full">
        <CinematicScroll />
      </section>

      {/* =====================================================================
          2. CHAPTER 02: CINEMATIC IDENTITY & PHILOSOPHY SECTION
          Directly follows Scene 05's "LET'S BUILD SOMETHING INTELLIGENT."
          ===================================================================== */}
      <IdentityPhilosophy />
    </div>
  );
}
