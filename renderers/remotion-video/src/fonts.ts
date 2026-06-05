// Call loadFont at module level — Remotion registers fonts on import.
import {loadFont as loadLocalFont} from '@remotion/fonts';
import {loadFont as loadNotoSansSC}  from '@remotion/google-fonts/NotoSansSC';
import {loadFont as loadNotoSerifSC} from '@remotion/google-fonts/NotoSerifSC';
import {loadFont as loadInter}       from '@remotion/google-fonts/Inter';
import {loadFont as loadSpaceMono}   from '@remotion/google-fonts/SpaceMono';
import {loadFont as loadNunito}      from '@remotion/google-fonts/Nunito';
import {staticFile} from 'remotion';

const alibabaPuhui = 'Alibaba PuHuiTi 3';
const alibabaPuhuiTitle = 'Alibaba PuHuiTi 3 Title Light';

void loadLocalFont({
  family: alibabaPuhuiTitle,
  url: staticFile('assets/fonts/AlibabaPuHuiTi-3-35-Thin.woff2'),
  weight: '300',
  display: 'block',
});

void loadLocalFont({
  family: alibabaPuhui,
  url: staticFile('assets/fonts/AlibabaPuHuiTi-3-45-Light.woff2'),
  weight: '300',
  display: 'block',
});

void loadLocalFont({
  family: alibabaPuhui,
  url: staticFile('assets/fonts/AlibabaPuHuiTi-3-55-Regular.woff2'),
  weight: '400',
  display: 'block',
});

const {fontFamily: notoSansSC}   = loadNotoSansSC('normal', {
  weights: ['400', '700', '900'],
  subsets: ['chinese-simplified'],
});
const {fontFamily: notoSerifSC}  = loadNotoSerifSC('normal', {
  weights: ['700', '900'],
  subsets: ['chinese-simplified'],
});
const {fontFamily: inter}        = loadInter('normal',     {weights: ['400', '700', '900']});
const {fontFamily: spaceMono}    = loadSpaceMono('normal', {weights: ['400', '700']});
const {fontFamily: nunito}       = loadNunito('normal',    {weights: ['400', '700', '900']});

export const fonts = {
  notoSansSC,
  notoSerifSC,
  inter,
  spaceMono,
  nunito,
  alibabaPuhui,
  alibabaPuhuiTitle,
};
