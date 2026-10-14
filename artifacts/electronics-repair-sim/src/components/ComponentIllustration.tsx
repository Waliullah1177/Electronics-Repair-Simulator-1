import type { ComponentType } from '@/types';

const componentNames: Record<ComponentType, string> = {
  resistor: 'Resistor',
  capacitor: 'Capacitor',
  diode: 'Diode',
  fuse: 'Fuse',
  mosfet: 'MOSFET',
  regulator: 'Voltage regulator',
  ic: 'Integrated circuit',
  connector: 'Connector',
  testpoint: 'Test point',
  inductor: 'Inductor',
  led: 'LED',
};

export default function ComponentIllustration({
  type,
  label,
  className = '',
}: {
  type: ComponentType;
  label?: string;
  className?: string;
}) {
  const accessibleName = label ?? componentNames[type];

  return (
    <svg
      viewBox="0 0 96 72"
      role="img"
      aria-label={accessibleName}
      className={`h-full w-full ${className}`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === 'resistor' && (
        <g filter="drop-shadow(0 3px 2px rgb(0 0 0 / 0.35))">
          <path d="M8 37h21m38 0h21" stroke="#b7c0c7" strokeWidth="3" />
          <path d="M8 36h21m38 0h21" stroke="#f1f3f4" strokeWidth="0.8" opacity=".75" />
          <rect x="27" y="26" width="42" height="21" rx="10.5" fill="#d8bd8a" stroke="#8e7650" strokeWidth="1.2" />
          <path d="M31 28q-4 8 0 17" stroke="#fff4d7" strokeWidth="2" opacity=".8" />
          <path d="M36 27v19" stroke="#654126" strokeWidth="4" />
          <path d="M45 26v21" stroke="#b63830" strokeWidth="4" />
          <path d="M54 26v21" stroke="#282522" strokeWidth="4" />
          <path d="M64 27v19" stroke="#d59a27" strokeWidth="3" />
        </g>
      )}

      {type === 'capacitor' && (
        <g filter="drop-shadow(0 3px 2px rgb(0 0 0 / 0.38))">
          <path d="M34 51v12m27-12v12" stroke="#c6cbd0" strokeWidth="2" />
          <ellipse cx="47.5" cy="22" rx="16" ry="5" fill="#69727a" stroke="#c5c9cc" />
          <path d="M31.5 22v26c0 3 7 6 16 6s16-3 16-6V22" fill="#323b43" stroke="#11161a" strokeWidth="1.4" />
          <path d="M32 25c1 2 4 3 7 4v23c-5-1-7-3-7-4z" fill="#dfe3df" opacity=".25" />
          <path d="M43 19l4 2 4-2 4 2 4-2" stroke="#30363b" strokeWidth="1.5" />
          <path d="M34 41h5" stroke="#e7e6d7" strokeWidth="2" />
          <g transform="translate(68 34)">
            <path d="M-5 17V7m10 10V7" stroke="#c7cbd0" strokeWidth="1.7" />
            <ellipse cy="-1" rx="8" ry="4" fill="#be9552" stroke="#f1ca80" />
            <path d="M-8-1v7c0 2 4 4 8 4s8-2 8-4v-7" fill="#d6b574" stroke="#90713d" />
          </g>
        </g>
      )}

      {type === 'diode' && (
        <g filter="drop-shadow(0 3px 2px rgb(0 0 0 / 0.36))">
          <path d="M7 36h21m40 0h21" stroke="#bac2c8" strokeWidth="2.2" />
          <rect x="25" y="27" width="46" height="18" rx="9" fill="#242a2d" stroke="#0d1114" strokeWidth="1.5" />
          <path d="M29 30q-5 6 0 12" stroke="#90999c" strokeWidth="2" opacity=".48" />
          <path d="M60 27v18" stroke="#d8dde0" strokeWidth="4" />
          <path d="M62 28v16" stroke="#fff" strokeWidth=".8" opacity=".75" />
        </g>
      )}

      {type === 'fuse' && (
        <g filter="drop-shadow(0 3px 2px rgb(0 0 0 / 0.35))">
          <path d="M7 36h23m36 0h23" stroke="#c4cbd0" strokeWidth="2.4" />
          <rect x="24" y="25" width="48" height="22" rx="10" fill="#c9d8d7" fillOpacity=".25" stroke="#d8e3e1" strokeWidth="1.4" />
          <path d="M30 28q-4 8 0 16" stroke="#fff" strokeWidth="2" opacity=".58" />
          <path d="M30 36q14-5 35 0" stroke="#b96a32" strokeWidth="1.8" />
          <path d="M24 26h7v20h-7a7 7 0 0 1-4-10 7 7 0 0 1 4-10z" fill="#c3c8ca" stroke="#81898e" />
          <path d="M72 26h-7v20h7a7 7 0 0 0 4-10 7 7 0 0 0-4-10z" fill="#c3c8ca" stroke="#81898e" />
        </g>
      )}

      {(type === 'mosfet' || type === 'regulator') && (
        <g filter="drop-shadow(0 3px 2px rgb(0 0 0 / 0.4))">
          <path d="M34 51v15m14-15v15m14-15v15" stroke="#c7c9c4" strokeWidth="2.5" />
          <path d="M30 23q0-4 4-4h28q4 0 4 4v29H30z" fill="#20252a" stroke="#101316" strokeWidth="1.5" />
          <path d="M33 23h30v-8q0-3-3-3H36q-3 0-3 3z" fill="#aeb5b7" stroke="#686f72" strokeWidth="1.3" />
          <circle cx="48" cy="16" r="3.2" fill="#22292d" stroke="#747d80" />
          <path d="M34 25h26" stroke="#596166" strokeWidth="1" opacity=".6" />
          <path d="M36 28v20" stroke="#fff" strokeWidth="1.4" opacity=".12" />
          {type === 'regulator' && (
            <text x="48" y="41" textAnchor="middle" fill="#d9dfdf" fontSize="6" fontFamily="monospace">7805</text>
          )}
        </g>
      )}

      {type === 'ic' && (
        <g filter="drop-shadow(0 3px 2px rgb(0 0 0 / 0.38))">
          {Array.from({ length: 6 }, (_, index) => (
            <g key={index}>
              <path d={`M30 ${23 + index * 5}h-12v7h12`} fill="#adb4b4" stroke="#60696c" strokeWidth=".8" />
              <path d={`M66 ${23 + index * 5}h12v7H66`} fill="#adb4b4" stroke="#60696c" strokeWidth=".8" />
            </g>
          ))}
          <rect x="28" y="15" width="40" height="42" rx="3" fill="#181d21" stroke="#050709" strokeWidth="1.6" />
          <path d="M42 15q6 9 12 0" stroke="#464d51" strokeWidth="1.3" />
          <circle cx="35" cy="22" r="2" fill="#717a7e" />
          <path d="M33 28h30" stroke="#30383d" strokeWidth="1" />
          <text x="48" y="42" textAnchor="middle" fill="#b8c1c3" fontSize="5.5" fontFamily="monospace">LM358</text>
        </g>
      )}

      {type === 'connector' && (
        <g filter="drop-shadow(0 3px 2px rgb(0 0 0 / 0.36))">
          <path d="M34 52v14m14-14v14m14-14v14" stroke="#c8c8be" strokeWidth="2.5" />
          <path d="M24 19q0-4 4-4h40v35H28q-4 0-4-4z" fill="#263e4d" stroke="#13242e" strokeWidth="1.5" />
          <path d="M29 25h34v18H29z" fill="#101a20" stroke="#415663" strokeWidth="1.2" />
          <rect x="32" y="28" width="7" height="12" rx="2" fill="#080d10" stroke="#b6a46f" />
          <rect x="45" y="28" width="7" height="12" rx="2" fill="#080d10" stroke="#b6a46f" />
          <rect x="58" y="28" width="3" height="12" rx="1" fill="#080d10" stroke="#b6a46f" />
          <path d="M27 18h38" stroke="#b1c0c6" strokeWidth="1.2" opacity=".55" />
        </g>
      )}

      {type === 'led' && (
        <g filter="drop-shadow(0 3px 2px rgb(0 0 0 / 0.35))">
          <path d="M40 48v16m16-16v12" stroke="#c7c9c4" strokeWidth="2" />
          <path d="M33 30a15 15 0 1 1 30 0v5c0 7-6 13-15 13s-15-6-15-13z" fill="#c63739" stroke="#f18375" strokeWidth="1.6" />
          <path d="M38 30a10 10 0 0 1 8-9" stroke="#ffd6ce" strokeWidth="2" opacity=".8" />
          <path d="M33 36h30" stroke="#842326" strokeWidth="1" />
          <circle cx="41" cy="27" r="2" fill="#fff" opacity=".6" />
        </g>
      )}

      {type === 'inductor' && (
        <g filter="drop-shadow(0 3px 2px rgb(0 0 0 / 0.38))">
          <path d="M24 53v11m48-11v11" stroke="#c4c8c5" strokeWidth="2.2" />
          <ellipse cx="48" cy="37" rx="23" ry="16" fill="#383b37" stroke="#171b19" strokeWidth="1.4" />
          <ellipse cx="48" cy="37" rx="15" ry="9" fill="#181c1b" stroke="#8c633c" strokeWidth="2" />
          <path d="M25 35c4-11 7 11 11 0s7 11 11 0 7 11 11 0 7 11 11 0 7 11 11 0" stroke="#c48749" strokeWidth="3" />
          <path d="M29 31c2-5 5-8 9-10" stroke="#f1c28a" strokeWidth="1.6" opacity=".7" />
        </g>
      )}

      {type === 'testpoint' && (
        <g filter="drop-shadow(0 3px 2px rgb(0 0 0 / 0.35))">
          <path d="M48 38v25" stroke="#c5c9c5" strokeWidth="3" />
          <circle cx="48" cy="30" r="13" fill="#b7bcb8" stroke="#eef0e5" strokeWidth="1.4" />
          <circle cx="48" cy="30" r="6" fill="#263330" stroke="#6a7773" />
          <path d="M40 25q5-7 12-4" stroke="#fff" strokeWidth="1.3" opacity=".7" />
        </g>
      )}
    </svg>
  );
}
