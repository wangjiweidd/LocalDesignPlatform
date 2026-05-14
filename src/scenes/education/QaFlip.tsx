import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Lottie} from '@remotion/lottie';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {PngAsset} from '../../components/illustrations/PngAsset';
import {bouncyEnter, clamp, staggerSpring} from '../../utils/springs';
import {getLottie} from '../../utils/assetCatalog';
import {splitKeyword} from '../../utils/text';

export const QaFlip: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardEnter  = bouncyEnter(frame, fps);
  const textEnter  = staggerSpring(frame, fps, 1);

  const isQuestion = shot.isQuestionShot ?? true;
  const cardBg     = isQuestion ? theme.colors.question : theme.colors.celebrate;
  const icon       = isQuestion ? '❓' : '💡';

  const lottieData = isQuestion
    ? getLottie(shot.lottieId ?? 'icon-question-wobble')
    : null;

  const parts = splitKeyword(shot.text, shot.keyword);

  // Card "flip" scale: starts narrow and widens to full
  const cardScaleX = interpolate(cardEnter, [0, 1], [0.05, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: isQuestion
          ? `linear-gradient(160deg, #e0e7ff, #ede9fe)`
          : `linear-gradient(160deg, #d1fae5, #ecfdf5)`,
      }}
    >
      {/* Q/A Icon */}
      <div
        style={{
          position:       'absolute',
          top:            180,
          left:           0,
          right:          0,
          display:        'flex',
          justifyContent: 'center',
          opacity:        cardEnter,
          transform:      `scale(${interpolate(cardEnter, [0, 1], [0.4, 1], clamp)})`,
        }}
      >
        {lottieData ? (
          <div style={{width: 200, height: 200}}>
            <Lottie animationData={lottieData} playbackRate={1} style={{width: '100%', height: '100%'}} />
          </div>
        ) : isQuestion ? (
          <div style={{fontSize: 140}}>❓</div>
        ) : (
          <PngAsset name="magnifier.png" width={200} height={200} />
        )}
      </div>

      {/* Flip card */}
      <div
        style={{
          position:     'absolute',
          left:         72,
          right:        72,
          top:          480,
          background:   cardBg,
          borderRadius: 32,
          padding:      '44px 48px',
          transform:    `scaleX(${cardScaleX})`,
          overflow:     'hidden',
        }}
      >
        <div
          style={{
            fontSize:     30,
            fontWeight:   700,
            color:        'rgba(255,255,255,0.85)',
            fontFamily:   theme.fonts.display,
            marginBottom: 20,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          {isQuestion ? '思考一下…' : '答案揭晓！'}
        </div>
        <div
          style={{
            fontSize:   58,
            fontWeight: 900,
            color:      '#fff',
            fontFamily: theme.fonts.body,
            lineHeight: 1.3,
            opacity:    cardScaleX > 0.5 ? textEnter : 0,
          }}
        >
          {parts.before}
          <span style={{color: 'rgba(255,255,255,0.75)', textDecoration: 'underline'}}>{parts.keyword}</span>
          {parts.after}
        </div>
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
