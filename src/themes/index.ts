export {themeOdin}    from './theme-odin';
export {themeYaoning} from './theme-yaoning';
export type {OdinTheme}    from './theme-odin';
export type {YaoningTheme} from './theme-yaoning';

import {themeOdin}    from './theme-odin';
import {themeYaoning} from './theme-yaoning';

export type Theme = typeof themeOdin | typeof themeYaoning;

export function selectTheme(track: string): Theme {
  return track === 'knowledge-sharing' ? themeOdin : themeYaoning;
}
