import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, RoundedBox, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import { Wrench, Zap, Gauge, Activity, Archive, Lightbulb, GraduationCap, Library, ClipboardList, Home } from 'lucide-react';

interface WorkshopProps {
  onOpenMissions: () => void;
  onOpenShop: () => void;
  onOpenInventory: () => void;
  onOpenSettings: () => void;
  onOpenPCB: (missionId: string) => void;
  onOpenAcademy: () => void;
  onOpenLibrary: () => void;
  onOpenGuidedRepair: () => void;
  onGoHome: () => void;
  currentMissionId: string | null;
  cameraMode: 'orbit' | 'overview';
}

// ─── Realistic ESD Work Mat ─────────────────────────────────────────────────
// Layered rubber mat with subtle scratches and surface variation
function ESDMat({ position }: { position: [number, number, number] }) {
  // Procedural scratch marks on the mat surface
  const scratches = useMemo(() => {
    const arr: { x: number; y: number; len: number; rot: number; opacity: number }[] = [];
    for (let i = 0; i < 25; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 1.8,
        len: 0.05 + Math.random() * 0.15,
        rot: Math.random() * Math.PI,
        opacity: 0.04 + Math.random() * 0.06,
      });
    }
    return arr;
  }, []);

  return (
    <group position={position}>
      {/* Conductive rubber body with a visible laminated edge */}
      <mesh receiveShadow>
        <boxGeometry args={[4.55, 0.045, 2.08]} />
        <meshStandardMaterial color="#222d35" roughness={0.96} metalness={0.015} />
      </mesh>
      <mesh position={[0, 0.024, 0]} receiveShadow>
        <boxGeometry args={[4.48, 0.008, 2.01]} />
        <meshStandardMaterial color="#2c3940" roughness={0.94} metalness={0.01} />
      </mesh>
      {/* Fine anti-static weave; restrained so the work surface stays calm */}
      <gridHelper args={[4.35, 44, '#46545a', '#35434a']} position={[0, 0.029, 0]} />
      {/* Edge binding and grounding snap */}
      <mesh position={[0, 0.002, 1.015]}>
        <boxGeometry args={[4.5, 0.018, 0.018]} />
        <meshStandardMaterial color="#b5a66e" roughness={0.48} metalness={0.28} />
      </mesh>
      <mesh position={[-2.12, 0.032, 0.76]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.025, 16]} />
        <meshStandardMaterial color="#9b9b91" roughness={0.3} metalness={0.72} />
      </mesh>
      <mesh position={[-2.12, 0.032, 0.76]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.04, 0.006, 6, 16]} />
        <meshStandardMaterial color="#d2c489" roughness={0.32} metalness={0.65} />
      </mesh>
      <LeadCable start={[-2.12, 0.032, 0.76]} end={[-2.3, -0.035, 0.98]} color="#282d2e" />
      {/* Scratch marks */}
      {scratches.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 0.017, s.y]}
          rotation={[-Math.PI / 2, 0, s.rot]}
        >
          <planeGeometry args={[s.len, 0.003]} />
          <meshStandardMaterial color="#0a1020" transparent opacity={s.opacity} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Realistic Workbench ────────────────────────────────────────────────────
// Thick wooden top with rounded edges, metal frame legs, ESD mat on top
function Workbench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Heavy technician-grade bench top, layered phenolic/steel construction */}
      <RoundedBox args={[5, 0.15, 2.5]} radius={0.025} position={[0, 1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#343b3d" roughness={0.62} metalness={0.28} />
      </RoundedBox>
      {/* Durable charcoal front fascia with brushed aluminum lip */}
      <mesh position={[0, 0.995, 1.237]}>
        <boxGeometry args={[4.96, 0.115, 0.018]} />
        <meshStandardMaterial color="#252d30" roughness={0.5} metalness={0.25} />
      </mesh>
      <mesh position={[0, 1.071, 1.245]}>
        <boxGeometry args={[4.9, 0.012, 0.012]} />
        <meshStandardMaterial color="#9a9a8f" roughness={0.3} metalness={0.75} />
      </mesh>
      {/* Legs — industrial aluminum frame style */}
      {[[-2.3, -1.05], [2.3, -1.05], [-2.3, 1.05], [2.3, 1.05]].map(([x, z], i) => (
        <group key={i} position={[x, 0.5, z]}>
          {/* Main leg */}
          <mesh castShadow>
            <boxGeometry args={[0.09, 1, 0.09]} />
            <meshStandardMaterial color="#51595a" roughness={0.38} metalness={0.72} />
          </mesh>
          {/* Foot pad */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.13, 0.055, 0.13]} />
            <meshStandardMaterial color="#252a2a" roughness={0.62} metalness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Cross braces for stability */}
      <mesh position={[0, 0.3, -1.05]} castShadow>
        <boxGeometry args={[4.5, 0.04, 0.04]} />
        <meshStandardMaterial color="#3a3a42" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 1.05]} castShadow>
        <boxGeometry args={[4.5, 0.04, 0.04]} />
        <meshStandardMaterial color="#3a3a42" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Grounding rail below front edge */}
      <mesh position={[0, 0.88, 1.18]}>
        <boxGeometry args={[4.7, 0.018, 0.025]} />
        <meshStandardMaterial color="#b49c55" roughness={0.38} metalness={0.72} />
      </mesh>
      {/* ESD mat on top */}
      <ESDMat position={[0, 1.075, 0]} />
    </group>
  );
}

// ─── Realistic Standing Digital Multimeter ──────────────────────────────────
// Accurate DMM with LCD, rotary dial with position markings, input jacks, test leads
function Multimeter3D({ position, hasPro }: { position: [number, number, number]; hasPro: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const lcdRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
    }
    if (lcdRef.current) {
      const mat = lcdRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.45 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  // Rotary dial position markings (8 positions around the dial)
  const dialPositions = useMemo(() => {
    const positions = [];
    const labels = ['OFF', 'V', 'mV', 'Ω', '►', 'A', 'mA', 'AC'];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      positions.push({
        x: Math.cos(angle) * 0.06,
        y: Math.sin(angle) * 0.06,
        label: labels[i],
      });
    }
    return positions;
  }, []);

  const bodyColor = hasPro ? '#263238' : '#b84232';
  const accentColor = hasPro ? '#172328' : '#772b25';

  return (
    <group ref={ref} position={position}>
      {/* Rugged double-shot meter casing with protective overmould */}
      <RoundedBox args={[0.62, 1.02, 0.34]} radius={0.065} castShadow receiveShadow>
        <meshStandardMaterial color={bodyColor} roughness={0.48} metalness={0.06} />
      </RoundedBox>
      <RoundedBox args={[0.58, 0.98, 0.035]} radius={0.055} position={[0, 0, 0.17]}>
        <meshStandardMaterial color={accentColor} roughness={0.58} metalness={0.04} />
      </RoundedBox>
      {/* Top bezel area — darker accent around display */}
      <mesh position={[0, 0.28, 0.165]}>
        <boxGeometry args={[0.48, 0.28, 0.02]} />
        <meshStandardMaterial color="#111a1c" roughness={0.28} metalness={0.18} />
      </mesh>
      {/* Readable high-contrast reflective LCD glass */}
      <mesh ref={lcdRef} position={[0, 0.26, 0.172]}>
        <boxGeometry args={[0.39, 0.18, 0.005]} />
        <meshStandardMaterial
          color="#a8b69d"
          emissive="#839579"
          emissiveIntensity={0.14}
          roughness={0.18}
          metalness={0.05}
        />
      </mesh>
      {/* LCD digits overlay — simulated 7-segment readout */}
      <Html position={[0, 0.26, 0.178]} center distanceFactor={3} occlude>
        <div className="font-mono text-[#17231e] text-[11px] font-bold tracking-wider select-none pointer-events-none">
          12.04V
        </div>
      </Html>
      {/* LCD glass reflection */}
      <mesh position={[0, 0.26, 0.176]}>
        <boxGeometry args={[0.37, 0.17, 0.001]} />
        <meshStandardMaterial color="#eff5dd" transparent opacity={0.12} roughness={0.08} metalness={0.08} />
      </mesh>

      {/* Rotary selector dial — central knob */}
      <mesh position={[0, -0.05, 0.168]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.115, 0.12, 0.075, 28]} />
        <meshStandardMaterial color="#222b2d" roughness={0.38} metalness={0.22} />
      </mesh>
      {/* Dial top — grooved texture */}
      <mesh position={[0, -0.05, 0.198]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.092, 0.092, 0.012, 28]} />
        <meshStandardMaterial color="#3c4545" roughness={0.32} metalness={0.38} />
      </mesh>
      {/* Dial indicator pointer — red arrow pointing to current position */}
      <mesh position={[0, -0.05, 0.202]}>
        <boxGeometry args={[0.012, 0.012, 0.043]} />
        <meshStandardMaterial color="#e0c97a" roughness={0.35} metalness={0.25} />
      </mesh>
      {/* Dial position markings — small bumps around the dial */}
      {dialPositions.map((p, i) => (
        <mesh key={i} position={[p.x * 1.8, -0.05 + p.y * 1.8, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.01, 8]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
      {/* Molded meter function legends around the rotary switch */}
      {['OFF', 'V⎓', 'mV', 'Ω', ')))', 'A', 'mA', 'V~'].map((label, i) => {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return (
          <Html key={label} position={[Math.cos(angle) * 0.155, -0.05 + Math.sin(angle) * 0.155, 0.17]} center distanceFactor={4}>
            <span className="font-mono text-[5px] font-bold text-[#d7d7c9] whitespace-nowrap pointer-events-none select-none">{label}</span>
          </Html>
        );
      })}

      {/* Input sockets — 4 jacks at bottom */}
      {[
        { x: -0.15, color: '#1a1a1a', label: 'COM' },
        { x: 0, color: '#cc2222', label: 'VΩ' },
        { x: 0.12, color: '#cc2222', label: 'mA' },
        { x: 0.2, color: '#cc2222', label: '10A' },
      ].map((jack, i) => (
        <group key={i} position={[jack.x, -0.32, 0.165]}>
          {/* Jack socket recess */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.03, 16]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Jack rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.022, 0.004, 8, 16]} />
            <meshStandardMaterial color={jack.color} roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      ))}
      <Html position={[0, -0.405, 0.17]} center distanceFactor={4}>
        <div className="flex gap-[9px] font-mono text-[4px] font-bold text-[#e0ded2] pointer-events-none select-none">
          <span>COM</span><span>VΩ</span><span>mA</span><span>10A</span>
        </div>
      </Html>

      {/* Brand label area */}
      <Html position={[0, 0.42, 0.17]} center distanceFactor={4} occlude>
          <div className="text-[7px] text-[#e6e4d8] font-bold tracking-wider select-none pointer-events-none uppercase">
          {hasPro ? 'PRO DMM' : 'DMM-100'}
        </div>
      </Html>

      {/* Test leads — red and black probes draped from the jacks */}
      {/* Black lead from COM jack */}
      <LeadCable start={[-0.15, -0.34, 0.165]} end={[-0.4, -0.15, 0.35]} color="#1a1a1a" />
      {/* Red lead from V jack */}
      <LeadCable start={[0, -0.34, 0.165]} end={[0.35, -0.1, 0.35]} color="#cc2222" />

      {/* Tilt stand at back */}
      <mesh position={[0, -0.1, -0.18]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.28, 0.34, 0.025]} />
        <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.47, 0.02]} castShadow>
        <boxGeometry args={[0.48, 0.035, 0.29]} />
        <meshStandardMaterial color="#273034" roughness={0.52} metalness={0.12} />
      </mesh>
    </group>
  );
}

// Curved test lead cable using a tube-like mesh
function LeadCable({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const curve = useMemo(() => {
    const mid: [number, number, number] = [
      (start[0] + end[0]) / 2 + 0.1,
      Math.min(start[1], end[1]) - 0.15,
      (start[2] + end[2]) / 2,
    ];
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    ]);
  }, [start, end]);

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.012, 8, false), [curve]);

  return (
    <group>
      <mesh geometry={tubeGeo} castShadow>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Probe tip at the end */}
      <mesh position={end} castShadow>
        <cylinderGeometry args={[0.015, 0.008, 0.06, 8]} />
        <meshStandardMaterial color={color === '#1a1a1a' ? '#333' : '#cc2222'} roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Metal probe tip */}
      <mesh position={[end[0], end[1] - 0.035, end[2]]} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.02, 8]} />
        <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ─── Soldering Station ──────────────────────────────────────────────────────
function SolderingStation({ position, hasPro }: { position: [number, number, number]; hasPro: boolean }) {
  const ironRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ironRef.current) {
      ironRef.current.rotation.z = Math.PI / 6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
    }
  });

  const stationColor = hasPro ? '#0d1a2e' : '#2a2a2e';

  return (
    <group position={position}>
      {/* Base station */}
      <RoundedBox args={[0.45, 0.18, 0.3]} radius={0.025} castShadow receiveShadow>
        <meshStandardMaterial color={stationColor} roughness={0.25} metalness={0.35} />
      </RoundedBox>
      {/* Digital display */}
      <mesh position={[0, 0.1, 0.13]}>
        <boxGeometry args={[0.22, 0.06, 0.01]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#4a8aff" emissiveIntensity={0.7} roughness={0.1} />
      </mesh>
      {/* Temp readout */}
      <Html position={[0, 0.1, 0.14]} center distanceFactor={3} occlude>
        <div className="font-mono text-blue-300 text-[8px] tracking-wider select-none pointer-events-none" style={{ textShadow: '0 0 3px #4a8aff' }}>
          350°C
        </div>
      </Html>
      {/* Control knobs */}
      {[-0.12, 0.12].map((x, i) => (
        <mesh key={i} position={[x, 0.04, 0.14]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.6} />
        </mesh>
      ))}
      {/* Iron holder — cradle */}
      <mesh position={[0.22, 0.12, 0]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.25, 12]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Holder base */}
      <mesh position={[0.22, 0.01, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.04, 16]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Soldering iron */}
      <group ref={ironRef} position={[0.22, 0.12, 0]}>
        {/* Handle */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.025, 0.3, 16]} />
          <meshStandardMaterial color="#c0392b" roughness={0.2} metalness={0.25} />
        </mesh>
        {/* Handle grip texture */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.023, 0.026, 0.12, 16]} />
          <meshStandardMaterial color="#8a2818" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Shaft */}
        <mesh position={[0, 0.33, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.014, 0.1, 12]} />
          <meshStandardMaterial color="#888" metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Tip */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.003, 0.04, 8]} />
          <meshStandardMaterial color="#bbb" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Hot tip glow */}
        <mesh position={[0, 0.425, 0]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshStandardMaterial color="#ff4500" emissive="#ff3000" emissiveIntensity={4} />
        </mesh>
        <pointLight position={[0, 0.425, 0]} intensity={0.25} color="#ff4500" distance={0.4} />
      </group>
      {/* Sponge tray */}
      <mesh position={[-0.15, 0.03, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.02, 0.08]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-0.15, 0.04, 0.08]}>
        <boxGeometry args={[0.1, 0.015, 0.06]} />
        <meshStandardMaterial color="#d4c896" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ─── Oscilloscope ───────────────────────────────────────────────────────────
function Oscilloscope3D({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const screen = ref.current.children[1] as THREE.Mesh;
      const mat = screen.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
    }
  });

  return (
    <group ref={ref} position={position}>
      <RoundedBox args={[0.75, 0.45, 0.38]} radius={0.025} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a2e" roughness={0.25} metalness={0.35} />
      </RoundedBox>
      {/* Screen bezel */}
      <mesh position={[0, 0.05, 0.2]}>
        <boxGeometry args={[0.5, 0.32, 0.01]} />
        <meshStandardMaterial color="#0a0a15" roughness={0.2} />
      </mesh>
      {/* Screen — green trace */}
      <mesh position={[0, 0.05, 0.205]}>
        <boxGeometry args={[0.45, 0.28, 0.005]} />
        <meshStandardMaterial color="#0a2a0a" emissive="#22ff22" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
      {/* Grid overlay */}
      <Html position={[0, 0.05, 0.21]} center distanceFactor={3} occlude>
        <div className="select-none pointer-events-none" style={{
          width: 80, height: 50,
          backgroundImage: 'linear-gradient(#22ff2233 1px, transparent 1px), linear-gradient(90deg, #22ff2233 1px, transparent 1px)',
          backgroundSize: '10px 10px',
          border: '1px solid #22ff2266',
        }} />
      </Html>
      {/* Control knobs */}
      {[-0.28, -0.14, 0.14, 0.28].map((x, i) => (
        <mesh key={i} position={[x, -0.14, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.025, 16]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.25} />
        </mesh>
      ))}
      {/* Power button */}
      <mesh position={[0.3, -0.14, 0.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 16]} />
        <meshStandardMaterial color="#0a0" emissive="#0a0" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// ─── Power Supply ───────────────────────────────────────────────────────────
function PowerSupply3D({ position }: { position: [number, number, number] }) {
  const displayRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (displayRef.current) {
      const mat = displayRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
    }
  });

  return (
    <group position={position}>
      <RoundedBox args={[0.65, 0.32, 0.38]} radius={0.025} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a2e" roughness={0.25} metalness={0.35} />
      </RoundedBox>
      {/* Display */}
      <mesh ref={displayRef} position={[-0.12, 0.08, 0.2]}>
        <boxGeometry args={[0.22, 0.08, 0.01]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#4a8aff" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
      <Html position={[-0.12, 0.08, 0.21]} center distanceFactor={3} occlude>
        <div className="font-mono text-blue-300 text-[7px] tracking-wider select-none pointer-events-none" style={{ textShadow: '0 0 3px #4a8aff' }}>
          12.00V
        </div>
      </Html>
      {/* Knobs */}
      {[0.12, 0.22].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.025, 16]} />
          <meshStandardMaterial color="#c0392b" metalness={0.4} roughness={0.25} />
        </mesh>
      ))}
      {/* Output terminals */}
      <mesh position={[-0.22, -0.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.04, 16]} />
        <meshStandardMaterial color="#cc2222" emissive="#ff0000" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[-0.22, -0.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.018, 0.003, 8, 16]} />
        <meshStandardMaterial color="#cc2222" metalness={0.4} />
      </mesh>
      <mesh position={[-0.1, -0.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.04, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.1, -0.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.018, 0.003, 8, 16]} />
        <meshStandardMaterial color="#333" metalness={0.4} />
      </mesh>
    </group>
  );
}

// ─── Realistic PCB on Bench (3D) ────────────────────────────────────────────
// Actual 3D board with FR4 substrate, copper traces, solder pads, and 3D components
function PCBOnBench({ position, onClick, label }: { position: [number, number, number]; onClick: () => void; label: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.003;
    }
  });

  // Generate component positions on the 3D board
  const boardComponents = useMemo(() => {
    const comps: { x: number; z: number; type: number; color: string; h: number; w: number; d: number; refDes: string }[] = [];
    const types = [
      { type: 0, color: '#c5a36c', h: 0.035, w: 0.11, d: 0.035, refDes: 'R1' },
      { type: 1, color: '#283337', h: 0.1, w: 0.055, d: 0.055, refDes: 'C2' },
      { type: 4, color: '#202526', h: 0.035, w: 0.09, d: 0.035, refDes: 'D1' },
      { type: 2, color: '#202526', h: 0.055, w: 0.13, d: 0.065, refDes: 'U1' },
      { type: 5, color: '#242b28', h: 0.065, w: 0.09, d: 0.09, refDes: 'L1' },
      { type: 3, color: '#24292a', h: 0.075, w: 0.075, d: 0.075, refDes: 'Q1' },
      { type: 7, color: '#293638', h: 0.075, w: 0.09, d: 0.07, refDes: 'J1' },
      { type: 8, color: '#aa4237', h: 0.065, w: 0.045, d: 0.045, refDes: 'LED1' },
    ];
    for (let i = 0; i < 8; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      comps.push({
        x: -0.3 + col * 0.2,
        z: -0.15 + row * 0.25,
        ...types[i],
      });
    }
    return comps;
  }, []);

  // Copper trace lines on the board surface
  const tracePoints = useMemo(() => {
    const pts: { x1: number; z1: number; x2: number; z2: number }[] = [];
    for (let i = 0; i < 6; i++) {
      pts.push({
        x1: -0.35 + i * 0.12,
        z1: -0.2 + (i % 2) * 0.1,
        x2: -0.25 + i * 0.12,
        z2: 0.2 - (i % 2) * 0.1,
      });
    }
    return pts;
  }, []);

  return (
    <group ref={ref} position={position}>
      {/* Fiberglass laminate edge and solder-mask surface */}
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <boxGeometry args={[1.04, 0.04, 0.69]} />
        <meshStandardMaterial color="#bd9d54" roughness={0.82} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0.022, 0]} receiveShadow>
        <boxGeometry args={[1, 0.008, 0.65]} />
        <meshStandardMaterial color="#315448" roughness={0.78} metalness={0.02} />
      </mesh>
      {/* Copper traces — thin lines on the surface */}
      {tracePoints.map((t, i) => (
        <mesh key={i} position={[(t.x1 + t.x2) / 2, 0.028, (t.z1 + t.z2) / 2]}>
          <boxGeometry args={[Math.abs(t.x2 - t.x1) || 0.01, 0.0025, Math.abs(t.z2 - t.z1) || 0.01]} />
          <meshStandardMaterial color="#bb8b42" roughness={0.28} metalness={0.68} />
        </mesh>
      ))}
      {/* Solder pads — small copper circles */}
      {boardComponents.map((c, i) => (
        <mesh key={`pad-${i}`} position={[c.x - c.w / 2, 0.028, c.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.015, 12]} />
          <meshStandardMaterial color="#daa520" roughness={0.2} metalness={0.7} />
        </mesh>
      ))}
      {/* Small plated vias and exposed solder-mask test pads */}
      {[
        [-0.42, -0.22], [-0.18, 0.22], [0.06, -0.22], [0.42, 0.22],
        [-0.02, 0], [0.24, 0],
      ].map(([vx, vz], i) => (
        <group key={`via-${i}`} position={[vx, 0.03, vz]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.003, 12]} />
            <meshStandardMaterial color="#bd9555" roughness={0.24} metalness={0.7} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.008, 12]} />
            <meshStandardMaterial color="#18332d" roughness={0.65} />
          </mesh>
        </group>
      ))}
      {boardComponents.map((c, i) => (
        <mesh key={`pad2-${i}`} position={[c.x + c.w / 2, 0.028, c.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.015, 12]} />
          <meshStandardMaterial color="#daa520" roughness={0.2} metalness={0.7} />
        </mesh>
      ))}
      {/* 3D Components on the board */}
      {boardComponents.map((c, i) => (
        <group key={`comp-${i}`} position={[c.x, 0.02 + c.h / 2, c.z]}>
          {c.type === 1 ? (
            // Electrolytic capacitor — cylinder
            <mesh castShadow>
              <cylinderGeometry args={[c.w / 2, c.w / 2, c.h, 16]} />
              <meshStandardMaterial color={c.color} roughness={0.3} metalness={0.2} />
            </mesh>
          ) : c.type === 8 ? (
            <mesh castShadow>
              <sphereGeometry args={[c.w * 0.55, 12, 10]} />
              <meshStandardMaterial color={c.color} roughness={0.24} metalness={0.04} emissive="#4c100e" emissiveIntensity={0.14} />
            </mesh>
          ) : c.type === 5 ? (
            <group>
              <mesh castShadow>
                <boxGeometry args={[c.w, c.h * 0.72, c.d]} />
                <meshStandardMaterial color={c.color} roughness={0.54} metalness={0.08} />
              </mesh>
              {[-0.022, 0, 0.022].map((offset) => (
                <mesh key={offset} position={[offset, c.h * 0.37, 0]}>
                  <torusGeometry args={[0.018, 0.003, 5, 10]} />
                  <meshStandardMaterial color="#bb8c50" roughness={0.34} metalness={0.65} />
                </mesh>
              ))}
            </group>
          ) : c.type === 4 ? (
            <group>
              <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.016, c.w * 0.52, 3, 8]} />
                <meshStandardMaterial color={c.color} roughness={0.34} metalness={0.04} />
              </mesh>
              <mesh position={[0.025, 0, c.d * 0.32]}>
                <boxGeometry args={[0.007, c.h * 0.82, 0.002]} />
                <meshStandardMaterial color="#d3d0c1" roughness={0.28} metalness={0.45} />
              </mesh>
            </group>
          ) : c.type === 3 ? (
            // MOSFET — TO-220 with metal tab
            <group>
              <mesh castShadow>
                <boxGeometry args={[c.w, c.h, c.d]} />
                <meshStandardMaterial color={c.color} roughness={0.25} metalness={0.4} />
              </mesh>
              <mesh position={[0, c.h / 2, 0]} castShadow>
                <boxGeometry args={[c.w + 0.01, 0.015, c.d]} />
                <meshStandardMaterial color="#aaa" roughness={0.1} metalness={0.9} />
              </mesh>
            </group>
          ) : (
            // Resistor, IC, etc. — box
            <mesh castShadow>
              <boxGeometry args={[c.w, c.h, c.d]} />
              <meshStandardMaterial color={c.color} roughness={0.35} metalness={0.2} />
            </mesh>
          )}
          {c.type === 7 && (
            <>
              <mesh position={[0, c.h * 0.12, c.d * 0.52]}>
                <boxGeometry args={[c.w * 0.6, c.h * 0.72, 0.012]} />
                <meshStandardMaterial color="#151c1d" roughness={0.65} />
              </mesh>
              {[-0.018, 0, 0.018].map((offset) => (
                <mesh key={offset} position={[offset, -c.h * 0.1, c.d * 0.53]}>
                  <boxGeometry args={[0.008, c.h * 0.5, 0.008]} />
                  <meshStandardMaterial color="#c4ae76" roughness={0.3} metalness={0.68} />
                </mesh>
              ))}
            </>
          )}
          {c.type === 3 && (
            <mesh position={[0, c.h * 0.5 + 0.003, c.d * 0.2]}>
              <circleGeometry args={[0.012, 12]} />
              <meshStandardMaterial color="#aeaa9e" roughness={0.3} metalness={0.75} />
            </mesh>
          )}
          <Html position={[0, c.h / 2 + 0.012, c.d / 2 + 0.004]} center distanceFactor={5}>
            <span className="font-mono text-[4px] font-semibold text-[#eee9d5] whitespace-nowrap pointer-events-none select-none">{c.refDes}</span>
          </Html>
          {c.type === 0 && (
            <>
              {/* Axial part leads and recognizable resistor bands */}
              <mesh position={[-c.w * 0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.005, 0.005, c.w * 0.42, 6]} />
                <meshStandardMaterial color="#b5b1a1" roughness={0.28} metalness={0.72} />
              </mesh>
              <mesh position={[c.w * 0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.005, 0.005, c.w * 0.42, 6]} />
                <meshStandardMaterial color="#b5b1a1" roughness={0.28} metalness={0.72} />
              </mesh>
              {[-0.022, 0, 0.022].map((offset, band) => (
                <mesh key={band} position={[offset, 0, c.d / 2 + 0.001]}>
                  <boxGeometry args={[0.009, c.h * 0.72, 0.002]} />
                  <meshStandardMaterial color={['#7e432e', '#292624', '#b68139'][band]} roughness={0.65} />
                </mesh>
              ))}
            </>
          )}
          {/* Solder joints at base */}
          <mesh position={[-c.w / 2, -c.h / 2 + 0.005, 0]}>
            <sphereGeometry args={[0.009, 7, 6]} />
            <meshStandardMaterial color="#aaa" roughness={0.15} metalness={0.8} />
          </mesh>
          <mesh position={[c.w / 2, -c.h / 2 + 0.005, 0]}>
            <sphereGeometry args={[0.009, 7, 6]} />
            <meshStandardMaterial color="#aaa" roughness={0.15} metalness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Mounting holes at corners */}
      {[[-0.45, -0.28], [0.45, -0.28], [-0.45, 0.28], [0.45, 0.28]].map(([hx, hz], i) => (
          <mesh key={`mh-${i}`} position={[hx, 0.028, hz]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.012, 0.018, 16]} />
          <meshStandardMaterial color="#888" roughness={0.2} metalness={0.8} />
        </mesh>
      ))}
      {/* Hover label */}
      <Html position={[0, 0.15, 0]} center distanceFactor={4}>
        <div className="px-2 py-1 bg-black/80 text-cyan-300 text-xs rounded border border-cyan-500/50 whitespace-nowrap pointer-events-none">
          {label}
        </div>
      </Html>
    </group>
  );
}

// ─── Component Storage Cabinets ─────────────────────────────────────────────
function ComponentStorage({ position, hasCabinet }: { position: [number, number, number]; hasCabinet: boolean }) {
  const drawers = useMemo(() => {
    return ['#c0392b', '#27ae60', '#2980b9', '#f39c12', '#8e44ad', '#1abc9c', '#e67e22', '#34495e'];
  }, []);

  if (hasCabinet) {
    return (
      <group position={position}>
        <RoundedBox args={[1.2, 1.8, 0.4]} radius={0.02} castShadow receiveShadow>
          <meshStandardMaterial color="#3a3025" roughness={0.5} metalness={0.25} />
        </RoundedBox>
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 2 }).map((_, col) => {
            const idx = row * 2 + col;
            return (
              <group key={idx} position={[-0.3 + col * 0.6, 0.65 - row * 0.42, 0.21]}>
                <mesh castShadow>
                  <boxGeometry args={[0.5, 0.3, 0.05]} />
                  <meshStandardMaterial color={drawers[idx]} roughness={0.3} metalness={0.25} />
                </mesh>
                {/* Drawer handle */}
                <mesh position={[0, 0, 0.03]}>
                  <boxGeometry args={[0.12, 0.02, 0.02]} />
                  <meshStandardMaterial color="#222" metalness={0.6} roughness={0.2} />
                </mesh>
              </group>
            );
          })
        )}
      </group>
    );
  }

  return (
    <group position={position}>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[-0.3 + (i % 2) * 0.6, 0.15 + Math.floor(i / 2) * 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.25, 0.3]} />
          <meshStandardMaterial color={['#4a3c30', '#3a3a4a', '#4a2a2a', '#2a3a2a'][i]} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Shelf with PCB boards and parts ────────────────────────────────────────
function Shelf({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const items = useMemo(() => {
    const arr: { x: number; color: string; h: number; w: number }[] = [];
    const colors = ['#0d5c30', '#1a2a4e', '#0d3a5c', '#4a2a1a', '#2a1a3a', '#1a4a2a'];
    for (let i = 0; i < 8; i++) {
      arr.push({
        x: -1.8 + i * 0.5 + Math.sin(i) * 0.1,
        color: colors[i % colors.length],
        h: 0.2 + ((i * 7) % 3) * 0.08,
        w: 0.25 + ((i * 3) % 2) * 0.05,
      });
    }
    return arr;
  }, []);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0, -0.1]} receiveShadow>
        <boxGeometry args={[4.5, 2.5, 0.08]} />
        <meshStandardMaterial color="#2a2218" roughness={0.8} />
      </mesh>
      {[0.8, 0, -0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.3, 0.06, 0.5]} />
          <meshStandardMaterial color="#332a20" roughness={0.6} />
        </mesh>
      ))}
      {items.map((item, i) => (
        <mesh key={i} position={[item.x, 0.8 + item.h / 2, 0]} castShadow>
          <boxGeometry args={[item.w, item.h, 0.3]} />
          <meshStandardMaterial color={item.color} roughness={0.4} metalness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Workshop Room ──────────────────────────────────────────────────────────
function Room() {
  return (
    <group>
      {/* Floor — workshop concrete/laminate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#343534" roughness={0.88} metalness={0.035} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 3, -5]} receiveShadow>
        <boxGeometry args={[20, 6, 0.2]} />
        <meshStandardMaterial color="#393b39" roughness={0.9} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-7, 3, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6, 20]} />
        <meshStandardMaterial color="#343735" roughness={0.9} />
      </mesh>
      {/* Right wall */}
      <mesh position={[7, 3, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6, 20]} />
        <meshStandardMaterial color="#343735" roughness={0.9} />
      </mesh>
      {/* Ceiling light fixture */}
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[2.5, 0.1, 0.6]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1.5} />
      </mesh>
      {/* Wall clock */}
      <mesh position={[4, 3.5, -4.9]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[4, 3.5, -4.88]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial color="#eee" />
      </mesh>
    </group>
  );
}

// ─── Small workshop detail props ────────────────────────────────────────────
function ComponentTray({ position }: { position: [number, number, number] }) {
  const trayColors = ['#c0392b', '#27ae60', '#2980b9', '#f39c12'];
  return (
    <group position={position}>
      {/* Tray base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.04, 0.2]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Compartments with small components */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[-0.1 + (i % 2) * 0.12, 0.025, -0.06 + Math.floor(i / 2) * 0.1]} castShadow>
          <boxGeometry args={[0.1, 0.02, 0.07]} />
          <meshStandardMaterial color={trayColors[i]} roughness={0.4} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Tweezers({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Tweezers arms */}
      <mesh position={[0, 0, 0.05]} rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[0.015, 0.005, 0.15]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0, 0.05]} rotation={[0, 0, -0.1]} castShadow>
        <boxGeometry args={[0.015, 0.005, 0.15]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.15} />
      </mesh>
    </group>
  );
}

// ─── Main Workshop Scene ────────────────────────────────────────────────────
function WorkshopScene({ onOpenPCB, currentMissionId }: { onOpenPCB: (id: string) => void; currentMissionId: string | null }) {
  const { state } = useGame();
  const hasPro = state.purchasedUpgrades.includes('multimeter-pro');
  const hasSolderPro = state.purchasedUpgrades.includes('soldering-station-pro');
  const hasOscilloscope = state.purchasedUpgrades.includes('oscilloscope');
  const hasBenchUpgrade = state.purchasedUpgrades.includes('workbench-upgrade');
  const hasCabinet = state.purchasedUpgrades.includes('inventory-expansion');
  const hasPowerSupply = state.purchasedUpgrades.includes('power-supply');
  const hasSecondBench = state.purchasedUpgrades.includes('repair-bench-2');

  return (
    <>
      <Room />

      {/* Main workbench */}
      <Workbench position={[0, 0, 0]} />

      {/* Magnifier lamp with bench upgrade */}
      {hasBenchUpgrade && (
        <group position={[2, 2, 0]}>
          <mesh position={[0, -0.5, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
            <meshStandardMaterial color="#444" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[0.5, 0, 0]}>
            <torusGeometry args={[0.2, 0.03, 8, 16]} />
            <meshStandardMaterial color="#666" metalness={0.7} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[0.5, 0, 0]}>
            <circleGeometry args={[0.18, 16]} />
            <meshStandardMaterial color="#fffae0" emissive="#fffae0" emissiveIntensity={0.5} transparent opacity={0.4} />
          </mesh>
          <pointLight position={[0, 0.1, 0.1]} intensity={0.3} color="#fffae0" distance={2} />
        </group>
      )}

      {/* Equipment on bench — multimeter standing prominently */}
      <Multimeter3D position={[-1.5, 1.15, -0.5]} hasPro={hasPro} />
      <SolderingStation position={[-1.8, 1.15, 0.3]} hasPro={hasSolderPro} />
      {hasOscilloscope && <Oscilloscope3D position={[1.5, 1.15, -0.5]} />}
      {hasPowerSupply && <PowerSupply3D position={[1.8, 1.15, 0.3]} />}

      {/* Component trays on bench */}
      <ComponentTray position={[0.6, 1.09, 0.6]} />
      <ComponentTray position={[0.6, 1.09, 0.35]} />
      {/* Tweezers on mat */}
      <Tweezers position={[0.3, 1.09, -0.3]} rotation={0.5} />

      {/* PCB on bench (active mission) */}
      {currentMissionId && (
        <PCBOnBench
          position={[0, 1.1, 0]}
          onClick={() => onOpenPCB(currentMissionId)}
          label="Active Repair Board — Click to inspect"
        />
      )}

      {/* Second workbench with upgrade */}
      {hasSecondBench && (
        <>
          <Workbench position={[4, 0, 1]} />
          <PCBOnBench
            position={[4, 1.1, 1]}
            onClick={() => currentMissionId && onOpenPCB(currentMissionId)}
            label="Bench 2 — Ready"
          />
        </>
      )}

      {/* Shelves on back wall */}
      <Shelf position={[-3, 0, -4]} />
      <Shelf position={[3, 0, -4]} />

      {/* Component storage */}
      <ComponentStorage position={[-5, 0, -3]} hasCabinet={hasCabinet} />

      {/* Posters/decor on walls */}
      <mesh position={[0, 3, -4.9]}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#1a3a2a" roughness={0.8} />
      </mesh>
      <mesh position={[-4, 3.5, -4.9]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial color="#2a1a1a" roughness={0.8} />
      </mesh>
    </>
  );
}

function CameraController({ mode }: { mode: 'orbit' | 'overview' }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    if (size.width < 640) {
      perspectiveCamera.position.set(0.15, 6.2, 9.2);
      perspectiveCamera.fov = 72;
    } else {
      perspectiveCamera.position.set(3.5, 3, 4);
      perspectiveCamera.fov = 50;
    }
    perspectiveCamera.updateProjectionMatrix();
    perspectiveCamera.lookAt(0, 1.1, 0);
  }, [camera, size.width]);
  useFrame(() => {
    if (mode === 'overview') {
      camera.lookAt(0, 1, 0);
    }
  });
  return null;
}

function WorkshopFallback() {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#171918]"
      role="img"
      aria-label="Illustrated electronics repair workbench. Three-dimensional rendering is unavailable in this browser."
    >
      <svg viewBox="0 0 1280 760" className="workshop-fallback-scene h-full w-full" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
        <defs>
          <linearGradient id="bench-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#675747" />
            <stop offset="1" stopColor="#302a26" />
          </linearGradient>
          <linearGradient id="mat" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#303b40" />
            <stop offset="1" stopColor="#141b20" />
          </linearGradient>
          <linearGradient id="meter" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f1a832" />
            <stop offset="1" stopColor="#b96913" />
          </linearGradient>
          <linearGradient id="lcd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c2d7bb" />
            <stop offset="1" stopColor="#718576" />
          </linearGradient>
          <pattern id="mat-weave" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M0 0H10M0 0V10" stroke="#9aa9a0" strokeOpacity=".12" strokeWidth="1" />
          </pattern>
          <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="170%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <rect width="1280" height="760" fill="#1b1f1e" />
        <path d="M0 0H1280V310L0 360Z" fill="#202422" />
        <path d="M95 65H1185V310H95Z" fill="#252a27" stroke="#3d403a" strokeWidth="8" />
        <path d="M125 88H1155V290H125Z" fill="#1d2220" />
        <path d="M0 345 1280 285 1280 690 0 760Z" fill="url(#bench-top)" />
        <path d="M0 690 1280 625V760H0Z" fill="#24201d" />
        <path d="M0 688 1280 623" stroke="#b39a7a" strokeOpacity=".35" strokeWidth="5" />
        <ellipse cx="620" cy="505" rx="445" ry="112" fill="#000" opacity=".52" filter="url(#soft-shadow)" />
        <path d="M235 360 893 327 1010 559 344 619Z" fill="#0c1114" opacity=".55" />
        <path d="M255 340 886 311 988 531 353 586Z" fill="#20282d" stroke="#7c7562" strokeWidth="9" />
        <path d="M263 343 880 316 977 524 359 576Z" fill="url(#mat)" />
        <path d="M263 343 880 316 977 524 359 576Z" fill="url(#mat-weave)" />
        <path d="M285 368 843 344 928 511 369 555Z" fill="none" stroke="#96a39c" strokeOpacity=".22" strokeDasharray="7 9" />
        <path d="M282 371 465 363 510 477 327 491Z" fill="#0c2532" stroke="#dfc05a" strokeWidth="5" />
        <path d="M293 380 452 373 494 469 335 482Z" fill="#173d43" stroke="#45615a" strokeWidth="3" />
        <g fill="none" stroke="#c48d47" strokeWidth="4" opacity=".84">
          <path d="M310 408 370 405 390 430 447 428M333 467 382 463 397 440 454 438M364 391 366 432 402 446 404 475M426 386 421 416 453 424" />
        </g>
        <g fill="#b8a064" stroke="#f1db93" strokeWidth="2">
          <circle cx="311" cy="408" r="6" /><circle cx="447" cy="428" r="6" /><circle cx="333" cy="467" r="6" />
          <circle cx="454" cy="438" r="6" /><circle cx="364" cy="391" r="6" /><circle cx="404" cy="475" r="6" />
        </g>
        <rect x="370" y="407" width="40" height="15" rx="3" fill="#a1a6a3" stroke="#d6d0be" strokeWidth="3" transform="rotate(-4 390 414)" />
        <rect x="430" y="449" width="27" height="27" rx="4" fill="#13191c" stroke="#6d7371" strokeWidth="3" transform="rotate(-7 443 462)" />
        <rect x="342" y="421" width="15" height="34" rx="7" fill="#8b6445" stroke="#d4b080" strokeWidth="3" transform="rotate(-7 349 438)" />
        <rect x="390" y="378" width="12" height="24" rx="5" fill="#8e3230" stroke="#e78f81" strokeWidth="3" transform="rotate(-5 396 390)" />
        <text x="308" y="397" fill="#d9dfc3" fontSize="13" fontFamily="monospace">U1</text>
        <text x="425" y="447" fill="#d9dfc3" fontSize="13" fontFamily="monospace">Q1</text>
        <text x="338" y="418" fill="#d9dfc3" fontSize="13" fontFamily="monospace">C1</text>
        <path d="M848 451C995 530 1037 485 1096 519" fill="none" stroke="#b51f1c" strokeWidth="10" strokeLinecap="round" />
        <path d="M837 472C1008 574 1042 540 1107 552" fill="none" stroke="#17191a" strokeWidth="10" strokeLinecap="round" />
        <path d="M851 459C1000 537 1038 495 1093 524" fill="none" stroke="#ff7770" strokeOpacity=".42" strokeWidth="3" />
        <g transform="translate(865 195) rotate(5 100 150)">
          <path d="M15 61Q15 38 40 36L174 47Q193 49 193 72V308Q193 327 173 331L35 319Q13 317 13 296Z" fill="#231e19" opacity=".7" transform="translate(8 10)" />
          <path d="M15 61Q15 38 40 36L174 47Q193 49 193 72V308Q193 327 173 331L35 319Q13 317 13 296Z" fill="url(#meter)" stroke="#f6c26e" strokeWidth="5" />
          <path d="M39 78 166 87V143L39 133Z" fill="#252b29" stroke="#8d5d24" strokeWidth="4" />
          <path d="M48 86 158 94V129L48 121Z" fill="url(#lcd)" />
          <text x="55" y="116" fill="#13231e" fontSize="29" fontFamily="monospace">12.46</text>
          <text x="60" y="158" fill="#fff1d0" fontSize="11" fontFamily="sans-serif">V  Ω  A   AUTO</text>
          <circle cx="104" cy="218" r="48" fill="#242627" stroke="#e1b96e" strokeWidth="5" />
          <circle cx="104" cy="218" r="35" fill="#171a1a" stroke="#71716c" strokeWidth="3" />
          <path d="M104 218 133 195" stroke="#f0d7a1" strokeWidth="8" strokeLinecap="round" />
          <g fill="#f4e2c2" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
            <text x="45" y="207">V</text><text x="147" y="211">Ω</text><text x="94" y="164">A</text><text x="48" y="252">mA</text>
          </g>
          <circle cx="69" cy="282" r="12" fill="#292d2d" stroke="#131515" strokeWidth="4" />
          <circle cx="139" cy="288" r="12" fill="#292d2d" stroke="#131515" strokeWidth="4" />
          <text x="51" y="309" fill="#242321" fontSize="11" fontFamily="sans-serif" fontWeight="bold">COM</text>
          <text x="123" y="316" fill="#242321" fontSize="11" fontFamily="sans-serif" fontWeight="bold">VΩ</text>
        </g>
        <g fill="#e8d7a8" opacity=".68" fontFamily="monospace" fontSize="18">
          <text x="84" y="102">PRECISION REPAIR · ESD SAFE</text>
          <text x="990" y="115">BENCH SUPPLY</text>
        </g>
        <circle cx="1115" cy="95" r="7" fill="#e7ad48" />
        <circle cx="1115" cy="95" r="17" fill="#e7ad48" opacity=".11" />
      </svg>
      <div className="absolute right-4 top-4 hidden rounded-lg border border-white/10 bg-black/65 px-3 py-2 text-xs text-white/75 backdrop-blur sm:block">
        WebGL unavailable — showing workshop preview
      </div>
    </div>
  );
}

function canCreateWebGLContext() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function Workshop3D({
  onOpenMissions,
  onOpenShop,
  onOpenInventory,
  onOpenSettings,
  onOpenPCB,
  onOpenAcademy,
  onOpenLibrary,
  onOpenGuidedRepair,
  onGoHome,
  currentMissionId,
}: WorkshopProps) {
  const { play } = useAudio();
  const { state } = useGame();
  const { t } = useTranslation();
  const hasWebGL = useMemo(canCreateWebGLContext, []);
  const hasAcademy = state.academy.completedLessons.length > 0;
  const allLessonsDone = state.academy.completedLessons.length >= 8;

  return (
    <div className="relative w-full h-full">
      {hasWebGL ? (
        <Canvas
          fallback={<WorkshopFallback />}
          shadows
          camera={{ position: [3.5, 3, 4], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          {/* Warm workshop background */}
          <color attach="background" args={['#252220']} />
          <fog attach="fog" args={['#252220', 10, 28]} />

        {/* ── Professional studio lighting setup ── */}
        {/* Soft warm ambient */}
        <ambientLight intensity={0.4} color="#fffae0" />
        {/* Key light — main directional from above-front */}
        <directionalLight
          position={[3, 8, 4]}
          intensity={1.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={20}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0005}
        />
        {/* Warm overhead fluorescent */}
        <pointLight position={[0, 5, 0]} intensity={0.6} color="#fffae0" distance={12} decay={1.5} />
        {/* Cool fill from left for balanced contrast */}
        <pointLight position={[-4, 3, -2]} intensity={0.25} color="#88aaff" distance={8} />
        {/* Warm rim from right */}
        <pointLight position={[4, 2, 3]} intensity={0.2} color="#fffae0" distance={6} />

          <WorkshopScene onOpenPCB={onOpenPCB} currentMissionId={currentMissionId} />

        {/* Soft contact shadows under objects */}
          <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={12} blur={2.5} far={5} />
          <ContactShadows position={[0, 1.08, 0]} opacity={0.15} scale={6} blur={1.5} far={3} />

        {/* Environment for reflections */}
          <Environment preset="warehouse" environmentIntensity={0.3} />

          <CameraController mode="orbit" />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={2.5}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 6}
            target={[0, 1.1, 0]}
          />
        </Canvas>
      ) : (
        <WorkshopFallback />
      )}

      {/* Workshop UI overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg px-4 py-2 text-white">
            <span className="text-xs text-zinc-400">{t('workshop.workshop')}</span>
            <h2 className="text-lg font-semibold">{t('workshop.electronicsLab')}</h2>
          </div>
          <button
            onClick={() => { play('click'); onGoHome(); }}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors border border-cyan-500 shadow-lg"
            title="Return to Home"
          >
            <Home size={18} />
            <span className="hidden sm:inline">{t('workshop.home')}</span>
          </button>
        </div>
        {currentMissionId && (
          <button
            onClick={() => { play('click'); onOpenPCB(currentMissionId); }}
            className="bg-cyan-900/80 backdrop-blur-sm border border-cyan-600 rounded-lg px-4 py-2.5 text-cyan-100 text-sm transition-all hover:bg-cyan-800 hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-2">
              <Wrench size={16} className="text-cyan-300" />
              <span>{t('workshop.continueRepair')}</span>
            </div>
          </button>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 flex-wrap justify-center max-w-[95%]">
        {!allLessonsDone && (
          <WorkshopButton icon={GraduationCap} label={t('menu.academy')} onClick={() => { play('click'); onOpenAcademy(); }} highlight />
        )}
        <WorkshopButton icon={Library} label={t('workshop.library')} onClick={() => { play('click'); onOpenLibrary(); }} />
        {!state.guidedRepairCompleted && allLessonsDone && (
          <WorkshopButton icon={ClipboardList} label={t('menu.guidedRepair')} onClick={() => { play('click'); onOpenGuidedRepair(); }} highlight />
        )}
        <WorkshopButton icon={Wrench} label={t('workshop.missions')} onClick={() => { play('click'); onOpenMissions(); }} />
        <WorkshopButton icon={Gauge} label={t('workshop.shop')} onClick={() => { play('click'); onOpenShop(); }} />
        <WorkshopButton icon={Archive} label={t('workshop.inventory')} onClick={() => { play('click'); onOpenInventory(); }} />
        <WorkshopButton icon={Lightbulb} label={t('workshop.settingsBtn')} onClick={() => { play('click'); onOpenSettings(); }} />
        <WorkshopButton icon={Home} label={t('workshop.home')} onClick={() => { play('click'); onGoHome(); }} />
      </div>

      {/* Hint text */}
      <div className="absolute bottom-4 right-4 text-zinc-400 text-xs bg-zinc-900/70 px-3 py-1.5 rounded hidden sm:block">
        {t('workshop.dragRotate')}
      </div>
    </div>
  );
}

function WorkshopButton({ icon: Icon, label, onClick, highlight }: { icon: any; label: string; onClick: () => void; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all hover:scale-105 active:scale-95 shadow-lg text-sm font-medium ${
        highlight
          ? 'bg-cyan-700/90 hover:bg-cyan-600 text-white border-cyan-500 animate-pulse'
          : 'bg-zinc-800/90 hover:bg-zinc-700 text-white border-zinc-600'
      }`}
    >
      <Icon size={18} className={highlight ? 'text-white' : 'text-cyan-400'} />
      <span>{label}</span>
    </button>
  );
}
