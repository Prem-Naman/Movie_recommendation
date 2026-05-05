"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    THREE: any
  }
}

export function AnimatedShaderHero({ 
  headline = { line1: "Emotion Driven", line2: "Movie Experience" }, 
  subtitle = "Your mood decides what you watch",
  buttons = { primary: "Start Detection", secondary: "Explore Movies" },
  onStart,
  onExplore
}: {
  headline?: { line1: string; line2: string }
  subtitle?: string
  buttons?: { primary: string; secondary: string }
  onStart?: () => void
  onExplore?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    let script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
    document.body.appendChild(script);

    script.onload = () => {
      const THREE = window.THREE;
      if (!containerRef.current || !THREE) return;
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.PlaneGeometry(20, 20, 64, 64);
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color("#000000") },
          color2: { value: new THREE.Color("#E50914") },
        },
        vertexShader: `
          varying vec2 vUv;
          uniform float time;
          void main() {
            vUv = uv;
            vec3 pos = position;
            pos.z = sin(pos.x * 2.0 + time) * 0.5 + cos(pos.y * 2.0 + time) * 0.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          void main() {
            float dist = distance(vUv, vec2(0.5));
            float mixValue = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
            vec3 color = mix(color1, color2, mixValue * (1.0 - dist));
            gl_FragColor = vec4(color, 1.0 - dist);
          }
        `,
        transparent: true,
        wireframe: true,
      });

      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -Math.PI / 3;
      scene.add(plane);

      camera.position.z = 5;
      camera.position.y = 1;

      let animationId: number;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        material.uniforms.time.value += 0.02;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
           containerRef.current.removeChild(renderer.domElement);
        }
      };
    };
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <div ref={containerRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
          <span className="block text-primary">{headline.line1}</span>
          <span className="block mt-2">{headline.line2}</span>
        </h1>
        
        <p className="mt-8 text-xl md:text-2xl text-gray-300 max-w-2xl font-light">
          {subtitle}
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/30"
          >
            {buttons.primary}
          </button>
          <button 
            onClick={onExplore}
            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all hover:scale-105"
          >
            {buttons.secondary}
          </button>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  )
}
