import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface AiRobotProps {
  size?:         number;
  bodyColor?:    string;
  accentColor?:  string;
  eyeColor?:     string;
}

export const AiRobot: React.FC<AiRobotProps> = ({
  size        = 280,
  bodyColor   = '#FFFFFF',
  accentColor = '#F97316',
  eyeColor    = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter    = spring({frame, fps, config: {damping: 8}});
  const scale    = interpolate(enter, [0, 1], [0, 1]);
  const floatY   = Math.sin((frame / fps) * Math.PI * 1.2) * 7;
  const eyeGlow  = 0.65 + 0.35 * Math.sin((frame / fps) * Math.PI * 2.4);
  const blinkPos = frame % Math.round(fps * 4);
  const eyeScaleY = blinkPos > Math.round(fps * 4) - 5
    ? interpolate(blinkPos, [Math.round(fps * 4) - 5, Math.round(fps * 4) - 3, Math.round(fps * 4)], [1, 0.08, 1])
    : 1;
  const ledPhase = (frame / fps) * Math.PI * 3;

  const h = size * 1.48;

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 220 326"
      style={{transform: `translateY(${floatY}px) scale(${scale})`, overflow: 'visible'}}
    >
      {/* Shadow */}
      <ellipse cx="110" cy="322" rx="66" ry="7" fill="rgba(0,0,0,0.12)" />

      {/* Antenna */}
      <line x1="110" y1="7" x2="110" y2="44" stroke={accentColor} strokeWidth="5" strokeLinecap="round"/>
      <circle cx="110" cy="7" r="11" fill={accentColor}/>
      <circle cx="110" cy="7" r="5"  fill="#fff" opacity="0.75"/>

      {/* Head */}
      <rect x="18" y="44" width="184" height="158" rx="40" fill={bodyColor}/>
      <rect x="18" y="44" width="184" height="158" rx="40" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2"/>

      {/* Left eye */}
      <circle cx="72"  cy="110" r="33" fill="#1A1A2E"/>
      <circle cx="72"  cy="110" r="22" fill={eyeColor} opacity={eyeGlow}/>
      <circle cx="72"  cy="110" r="10" fill="#fff"
        style={{transformOrigin: '72px 110px', transform: `scaleY(${eyeScaleY})`}}/>
      <circle cx="79"  cy="102" r="5"  fill="#fff" opacity="0.85"/>

      {/* Right eye */}
      <circle cx="148" cy="110" r="33" fill="#1A1A2E"/>
      <circle cx="148" cy="110" r="22" fill={eyeColor} opacity={eyeGlow}/>
      <circle cx="148" cy="110" r="10" fill="#fff"
        style={{transformOrigin: '148px 110px', transform: `scaleY(${eyeScaleY})`}}/>
      <circle cx="155" cy="102" r="5"  fill="#fff" opacity="0.85"/>

      {/* Mouth LED bar */}
      <rect x="57" y="165" width="106" height="24" rx="12" fill="#E2E8F0"/>
      {[77, 98, 119, 140].map((x, i) => (
        <circle key={i} cx={x} cy="177" r="7" fill={accentColor}
          opacity={0.35 + 0.65 * ((Math.sin(ledPhase + i * 0.9) + 1) / 2)}/>
      ))}

      {/* Ears */}
      <rect x="3"   y="82" width="18" height="62" rx="9" fill={bodyColor}/>
      <rect x="3"   y="82" width="18" height="62" rx="9" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2"/>
      <rect x="199" y="82" width="18" height="62" rx="9" fill={bodyColor}/>
      <rect x="199" y="82" width="18" height="62" rx="9" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2"/>

      {/* Body */}
      <rect x="26" y="210" width="168" height="98" rx="30" fill={bodyColor}/>
      <rect x="26" y="210" width="168" height="98" rx="30" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2"/>

      {/* AI badge */}
      <rect x="62" y="224" width="96" height="56" rx="16" fill={accentColor}/>
      <text x="110" y="261" textAnchor="middle" fill="#fff" fontSize="30" fontWeight="900" fontFamily="monospace">AI</text>

      {/* Arms */}
      <rect x="0"   y="218" width="24" height="52" rx="12" fill={bodyColor}/>
      <rect x="0"   y="218" width="24" height="52" rx="12" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2"/>
      <rect x="196" y="218" width="24" height="52" rx="12" fill={bodyColor}/>
      <rect x="196" y="218" width="24" height="52" rx="12" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2"/>

      {/* Legs */}
      <rect x="54"  y="304" width="42" height="22" rx="11" fill={bodyColor}/>
      <rect x="54"  y="304" width="42" height="22" rx="11" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2"/>
      <rect x="124" y="304" width="42" height="22" rx="11" fill={bodyColor}/>
      <rect x="124" y="304" width="42" height="22" rx="11" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2"/>
    </svg>
  );
};
