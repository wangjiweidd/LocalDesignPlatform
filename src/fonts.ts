// Call loadFont at module level — Remotion registers fonts on import.
import {loadFont as loadNotoSansSC} from '@remotion/google-fonts/NotoSansSC';
import {loadFont as loadInter}      from '@remotion/google-fonts/Inter';
import {loadFont as loadSpaceMono}  from '@remotion/google-fonts/SpaceMono';
import {loadFont as loadNunito}     from '@remotion/google-fonts/Nunito';
import {loadFont as loadZCOOL}      from '@remotion/google-fonts/ZCOOLKuaiLe';

const {fontFamily: notoSansSC}   = loadNotoSansSC('normal', {
  weights: ['400', '700', '900'],
  subsets: ['chinese-simplified'],
});
const {fontFamily: inter}        = loadInter('normal',     {weights: ['400', '700', '900']});
const {fontFamily: spaceMono}    = loadSpaceMono('normal', {weights: ['400', '700']});
const {fontFamily: nunito}       = loadNunito('normal',    {weights: ['400', '700', '900']});
const {fontFamily: zcoolKuaiLe} = loadZCOOL('normal',    {weights: ['400']});

export const fonts = {notoSansSC, inter, spaceMono, nunito, zcoolKuaiLe};
