import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticlesBackground = () => {
  const particlesInit = async (engine) => {
    await loadFull(engine); 
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 z-0"
      options={{
        background: {
          color: {
            value: "transparent", 
          },
        },
        fpsLimit: 60, 
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            onClick: {
              enable: true,
              mode: "push", 
            },
          },
          modes: {
            repulse: {
              distance: 100, 
              duration: 0.4, 
            },
            push: {
              quantity: 4, 
            },
          },
        },
        particles: {
          color: {
            value: ["#ffffff", "#00ff00", "#0000ff"],
          },
          links: {
            color: "#ffffff", 
            distance: 150, 
            enable: true, 
            opacity: 0.4, 
            width: 1, 
          },
          move: {
            direction: "none", 
            enable: true, 
            outModes: {
              default: "out", 
            },
            random: false, 
            speed: 6, 
            straight: false, 
          },
          number: {
            density: {
              enable: true,
              area: 800, 
            },
            value: 50, 
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle", 
          },
          size: {
            value: { min: 2, max: 5 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;