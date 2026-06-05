import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationCoverIconKey, EducationScriptData} from '../data/types-v2';
import {fonts} from '../fonts';
import {BrandBadge} from '../components/BrandBadge';
import {themeYaoning} from '../themes';
import {bouncyEnter, clamp, staggerSpring} from '../utils/springs';
import {splitKeyword} from '../utils/text';

type YaoningCoverProps = {cover: EducationScriptData['cover']; accentColor?: string};

export const YaoningCover: React.FC<YaoningCoverProps> = ({cover, accentColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleEnter = bouncyEnter(frame, fps);
  const heroEnter = staggerSpring(frame, fps, 1, 8);

  const accent = accentColor ?? '#E07A14';
  const ink = '#1F1408';
  const coffee = '#5F3B13';
  const gold = '#FFB52E';
  const violet = '#6F62A8';
  const parts = splitKeyword(cover.title, cover.titleHighlight);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, #FFF9F0 0%, #FFEAD6 48%, #FFE2CF 100%), ' +
          'radial-gradient(140% 86% at 50% 10%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.36) 42%, rgba(255,255,255,0) 76%), ' +
          'linear-gradient(122deg, rgba(255, 214, 171, 0.34) 0%, rgba(255, 214, 171, 0) 34%), ' +
          'linear-gradient(238deg, rgba(181, 225, 201, 0.2) 0%, rgba(181, 225, 201, 0) 30%)',
      }}
    >
      <BrandBadge compact style={{left: 68, top: 58}} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.16) 0 12%, rgba(255,255,255,0) 12% 24%, rgba(255,255,255,0.09) 24% 34%, rgba(255,255,255,0) 34% 100%)',
          opacity: 0.42,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 112,
          right: 112,
          top: 242,
          height: 332,
          borderRadius: 999,
          background:
            'radial-gradient(60% 84% at 50% 48%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.58) 48%, rgba(255,255,255,0) 100%)',
          filter: 'blur(8px)',
          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 326,
          textAlign: 'center',
          opacity: titleEnter,
          transform: `translateY(${interpolate(titleEnter, [0, 1], [46, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            color: ink,
            fontSize: 96,
            lineHeight: 1.22,
            fontWeight: 300,
            fontFamily: `"${fonts.alibabaPuhuiTitle}", ${themeYaoning.fonts.body}`,
            fontSynthesis: 'none',
            letterSpacing: 0,
            whiteSpace: 'pre-line',
            textWrap: 'balance',
            textShadow: '0 10px 28px rgba(255, 248, 236, 0.72)',
            maxWidth: 920,
            margin: '0 auto',
          }}
        >
          {parts.before}
          <span style={{color: accent}}>{parts.keyword}</span>
          {parts.after}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 98,
          right: 98,
          top: 804,
          display: 'flex',
          justifyContent: 'center',
          opacity: heroEnter,
          transform: `translateY(${interpolate(heroEnter, [0, 1], [36, 0], clamp)}px) scale(${interpolate(heroEnter, [0, 1], [0.92, 1], clamp)})`,
        }}
      >
        <CoverIllustration
          iconKey={cover.heroIconKey ?? 'three-bars'}
          accent={accent}
          gold={gold}
          violet={violet}
          ink={ink}
          coffee={coffee}
        />
      </div>
    </AbsoluteFill>
  );
};

const CoverIllustration: React.FC<{
  iconKey: EducationCoverIconKey;
  accent: string;
  gold: string;
  violet: string;
  ink: string;
  coffee: string;
}> = ({iconKey, accent, gold, violet, ink, coffee}) => {
  switch (iconKey) {
    case 'question-mark':
      return <QuestionCover accent={accent} gold={gold} violet={violet} ink={ink} coffee={coffee} />;
    case 'shield':
      return <ShieldCover accent={accent} gold={gold} violet={violet} ink={ink} />;
    case 'lightbulb':
      return <LightbulbCover accent={accent} gold={gold} violet={violet} ink={ink} />;
    case 'check-seal':
      return <ChecklistCover accent={accent} gold={gold} violet={violet} ink={ink} coffee={coffee} />;
    case 'three-bars':
    default:
      return <SchoolStagesCover accent={accent} gold={gold} violet={violet} ink={ink} coffee={coffee} />;
  }
};

const SchoolStagesCover: React.FC<{
  accent: string;
  gold: string;
  violet: string;
  ink: string;
  coffee: string;
}> = ({accent, gold, violet, ink, coffee}) => {
  return (
    <svg width={820} height={520} viewBox="0 0 820 520" aria-hidden>
      <ellipse cx={410} cy={286} rx={286} ry={192} fill="rgba(255,255,255,0.34)" />
      <ellipse cx={410} cy={304} rx={238} ry={156} fill="rgba(255, 226, 194, 0.42)" />

      <path
        d="M118 330 C252 192 568 190 704 330"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={34}
        strokeLinecap="round"
        opacity={0.72}
      />
      <path
        d="M118 330 C252 192 568 190 704 330"
        fill="none"
        stroke="#FFD38E"
        strokeWidth={14}
        strokeLinecap="round"
      />
      <path
        d="M118 330 C252 192 568 190 704 330"
        fill="none"
        stroke={accent}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray="18 18"
        opacity={0.72}
      />

      {[118, 418, 704].map((cx, index) => {
        const cy = index === 1 ? 230 : 330;
        return (
          <g key={cx}>
            <circle cx={cx} cy={cy} r={42} fill="rgba(255,255,255,0.84)" />
            <circle cx={cx} cy={cy} r={26} fill={index === 1 ? accent : '#FFF6E8'} stroke={index === 1 ? accent : ink} strokeWidth={index === 1 ? 0 : 5} />
            {index === 1 ? <circle cx={cx} cy={cy} r={9} fill="#FFFFFF" /> : null}
          </g>
        );
      })}

      <g transform="translate(222 164)">
        <circle cx={84} cy={112} r={92} fill="url(#clock-fill)" opacity={0.92} />
        <circle cx={84} cy={112} r={74} fill="#FFF9EF" />
        <circle cx={84} cy={112} r={10} fill={gold} stroke={ink} strokeWidth={4} />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1={84 + Math.cos((deg * Math.PI) / 180) * 48}
            y1={112 + Math.sin((deg * Math.PI) / 180) * 48}
            x2={84 + Math.cos((deg * Math.PI) / 180) * 64}
            y2={112 + Math.sin((deg * Math.PI) / 180) * 64}
            stroke={ink}
            strokeWidth={deg % 180 === 0 ? 6 : 4}
            strokeLinecap="round"
          />
        ))}
        <line x1={84} y1={112} x2={122} y2={80} stroke={ink} strokeWidth={9} strokeLinecap="round" />
        <line x1={84} y1={112} x2={56} y2={144} stroke={ink} strokeWidth={12} strokeLinecap="round" />
      </g>

      <g transform="translate(396 126)">
        <rect x={38} y={28} width={238} height={288} rx={30} fill={violet} opacity={0.96} />
        <rect x={18} y={0} width={280} height={336} rx={34} fill="#FFF8F1" stroke={violet} strokeWidth={10} />
        <rect x={44} y={32} width={228} height={274} rx={20} fill="#FFFFFF" stroke="#F3D5A6" strokeWidth={2} />
        <text x={158} y={94} textAnchor="middle" fontSize={48} fontWeight={500} fill={coffee} fontFamily={fonts.alibabaPuhui}>作业本</text>
        <path d="M98 116 C126 108 192 108 220 116" stroke="#9F7C59" strokeWidth={4} fill="none" strokeLinecap="round" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(86 ${154 + i * 64})`}>
            <rect width={28} height={28} rx={7} fill="#FFF8EF" stroke="#8C6A46" strokeWidth={3.5} />
            {i === 1 ? (
              <path d="M7 16 L15 24 L28 8" fill="none" stroke={accent} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
            <line x1={48} y1={14} x2={166} y2={14} stroke="#C7B07C" strokeWidth={5} strokeLinecap="round" />
          </g>
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx={0} cy={70 + i * 44} rx={18} ry={9} fill={violet} stroke="#4E3DA1" strokeWidth={3.5} />
        ))}
      </g>

      <g transform="translate(632 98) rotate(24)">
        <rect x={0} y={0} width={40} height={248} rx={18} fill="url(#pencil-fill)" />
        <rect x={0} y={0} width={40} height={54} rx={15} fill="#F59FB2" />
        <rect x={0} y={40} width={40} height={16} fill="#DDD4CA" />
        <polygon points="0,248 20,290 40,248" fill="#1F1408" />
        <polygon points="10,248 20,274 30,248" fill="#FFF3D4" />
      </g>

      <path d="M104 388 L124 432 L106 484 H64 C70 438 82 410 104 388 Z" fill="#8DCE9F" />
      <path d="M126 404 L150 446 L136 492 H90 C98 450 108 424 126 404 Z" fill="#B3DFC0" />

      <path d="M182 184 C156 166 136 164 114 180" fill="none" stroke={violet} strokeWidth={9} strokeLinecap="round" />
      <path d="M664 170 C636 146 606 144 580 164" fill="none" stroke={violet} strokeWidth={9} strokeLinecap="round" />
      <circle cx={156} cy={126} r={12} fill="rgba(255,255,255,0.5)" stroke="#F7BC73" strokeWidth={3.5} />
      <circle cx={724} cy={360} r={12} fill="rgba(255,255,255,0.5)" stroke="#F7BC73" strokeWidth={3.5} />

      <defs>
        <linearGradient id="clock-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD168" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="pencil-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFC953" />
          <stop offset="100%" stopColor="#E38A05" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const QuestionCover: React.FC<{accent: string; gold: string; violet: string; ink: string; coffee: string}> = ({
  accent,
  gold,
  violet,
  ink,
}) => (
  <svg width={620} height={520} viewBox="0 0 620 520" aria-hidden>
    <ellipse cx={310} cy={264} rx={214} ry={166} fill="rgba(255,255,255,0.3)" />
    <circle cx={262} cy={240} r={128} fill="#FFF9ED" stroke={ink} strokeWidth={12} />
    <path d="M232 154 C250 134 278 122 310 124 C356 126 392 156 392 202 C392 246 362 270 328 292 C304 306 294 322 294 348" fill="none" stroke={accent} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={294} cy={392} r={20} fill={gold} stroke={ink} strokeWidth={8} />
    <rect x={340} y={156} width={142} height={188} rx={28} fill="#FFF7EF" stroke={violet} strokeWidth={12} />
    <path d="M372 206 H448 M372 246 H448 M372 286 H430" stroke="#A98E66" strokeWidth={8} strokeLinecap="round" />
    <path d="M508 110 L578 278" stroke={gold} strokeWidth={34} strokeLinecap="round" />
    <path d="M528 126 C506 136 488 154 476 180" fill="none" stroke={violet} strokeWidth={10} strokeLinecap="round" />
  </svg>
);

const ShieldCover: React.FC<{accent: string; gold: string; violet: string; ink: string}> = ({
  accent,
  gold,
  violet,
  ink,
}) => (
  <svg width={620} height={520} viewBox="0 0 620 520" aria-hidden>
    <ellipse cx={310} cy={262} rx={228} ry={170} fill="rgba(255,255,255,0.3)" />
    <path d="M312 102 L448 156 V278 C448 364 386 430 312 454 C238 430 176 364 176 278 V156 Z" fill="#FFF9ED" stroke={ink} strokeWidth={12} />
    <path d="M240 268 L292 320 L388 216" fill="none" stroke={accent} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={146} cy={214} r={24} fill={gold} opacity={0.72} />
    <circle cx={490} cy={208} r={22} fill={violet} opacity={0.5} />
    <path d="M112 338 C164 294 208 290 252 312" fill="none" stroke={gold} strokeWidth={16} strokeLinecap="round" opacity={0.8} />
  </svg>
);

const LightbulbCover: React.FC<{accent: string; gold: string; violet: string; ink: string}> = ({
  accent,
  gold,
  violet,
  ink,
}) => (
  <svg width={620} height={520} viewBox="0 0 620 520" aria-hidden>
    <ellipse cx={310} cy={252} rx={220} ry={168} fill="rgba(255,255,255,0.3)" />
    <path d="M312 108 a122 122 0 0 1 122 122 c0 54 -26 88 -58 122 v40 H248 v-40 c-34 -34 -58 -68 -58 -122 a122 122 0 0 1 122 -122 z" fill="#FFF7E8" stroke={ink} strokeWidth={12} />
    <path d="M272 144 L272 252 M352 144 L352 252 M312 128 L312 236" stroke={gold} strokeWidth={16} strokeLinecap="round" />
    <line x1={258} y1={420} x2={366} y2={420} stroke={ink} strokeWidth={10} strokeLinecap="round" />
    <line x1={268} y1={450} x2={356} y2={450} stroke={ink} strokeWidth={10} strokeLinecap="round" />
    <circle cx={188} cy={134} r={18} fill={accent} opacity={0.35} />
    <circle cx={454} cy={164} r={18} fill={violet} opacity={0.35} />
  </svg>
);

const ChecklistCover: React.FC<{accent: string; gold: string; violet: string; ink: string; coffee: string}> = ({
  accent,
  gold,
  violet,
  ink,
  coffee,
}) => (
  <svg width={620} height={520} viewBox="0 0 620 520" aria-hidden>
    <ellipse cx={310} cy={266} rx={210} ry={164} fill="rgba(255,255,255,0.3)" />
    <rect x={154} y={110} width={312} height={316} rx={36} fill="#FFF9EE" stroke={violet} strokeWidth={12} />
    <text x={310} y={182} textAnchor="middle" fontSize={54} fontWeight={800} fill={coffee} fontFamily={fonts.alibabaPuhui}>家庭清单</text>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(206 ${224 + i * 68})`}>
        <rect width={34} height={34} rx={7} fill="#FFF" stroke={coffee} strokeWidth={4} />
        {i !== 1 ? <path d="M7 18 L16 28 L30 10" fill="none" stroke={i === 0 ? accent : gold} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
        <line x1={56} y1={17} x2={184} y2={17} stroke="#BEA77D" strokeWidth={7} strokeLinecap="round" />
      </g>
    ))}
    <circle cx={110} cy={260} r={28} fill={gold} opacity={0.62} />
    <circle cx={508} cy={168} r={22} fill={accent} opacity={0.4} />
    <circle cx={478} cy={382} r={18} fill={violet} opacity={0.44} />
  </svg>
);
