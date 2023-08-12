import dayjs, { extend } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Call, Strings } from 'hotscript';

extend(duration);

export const formatKey = (val: string) =>
  val.charAt(0).toUpperCase() +
  val
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase()
    .slice(1)
    .split('_')
    .join(' ');
export const formatDateStrict = (val: string) => dayjs(val).format('YYYY-MM-DD');
export const formatDate = (val: string) => dayjs(val).format('MMM DD, YYYY');
export const formatDateTime = (val: string | number) => dayjs(val).format('MMM DD, YYYY hh:mm');
export const formatDateToTimestamp = (val: string) => dayjs(val).valueOf();
export const formatDateToISOstring = (val: string) => dayjs(val).toISOString().toString().replaceAll('Z', '');
export const formatTime = (val: string | number) => dayjs.duration(+val * 1000).format('mm:ss');
export const formatTimeFromTimestamp = (val: string | number) => dayjs(val).format('h:mm A');
export const formatProctoringMode = (val: 'online' | 'onsite' | 'general') =>
  val === 'general' ? 'Standard proctoring' : val === 'online' ? 'Online proctoring' : 'Onsite proctoring';
export const trim = (val: number | string, decimals = 2) => (+val).toFixed(decimals);
export const formatPhoneNumber = (val: string) =>
  val.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
export const convertSecToMin = (val: number) =>
  `${Math.floor(val / 60)}:${val % 60 < 10 ? '0' : ''}${val % 60}`;
export const capitalize = (val: string) => val.charAt(0).toUpperCase() + val.slice(1);
export function decapitalize<T extends string>(str: T) {
  return (str.charAt(0).toLowerCase() + str.slice(1)) as Call<Strings.Uncapitalize, T>;
}
export const ExtractFromParenthesis = (string: string) => {
  const regex = /\((.*?)\)/;
  const matches = regex.exec(string);
  return matches?.[1] ?? '';
};
export const formatTimezoneToUTC = (tz: string, hereDate?: string | Date) => {
  hereDate = new Date(hereDate || Date.now());
  hereDate.setMilliseconds(0); // for nice rounding

  const hereOffsetHrs = (hereDate.getTimezoneOffset() / 60) * -1;
  const thereLocaleStr = hereDate.toLocaleString('en-US', { timeZone: tz });
  const thereDate = new Date(thereLocaleStr);
  const diffHrs = (thereDate.getTime() - hereDate.getTime()) / 1000 / 60 / 60;
  const thereOffsetHrs = hereOffsetHrs + diffHrs;

  return {
    text: `UTC${thereOffsetHrs > 0 ? '+' : ''}${thereOffsetHrs}`,
    value: thereOffsetHrs,
  };
};
export const convertFileSizeToMb = (size: number) => +(size / 1024 / 1024).toFixed(2);
export const formatFileExtensions = (extensions: string[]) =>
  extensions.map((ext: string | number) => `.${ext}`).join(', ');
export const formatNullableText = (val: string | null) => val || 'N/A';
export const getTimeDifference = (currentTime: number, previousTime: number | string) =>
  dayjs(currentTime).diff(dayjs(previousTime), 's');
export const formatScore = (score: number, scale?: number) => {
  try {
    return !['string', 'number'].includes(typeof score)
      ? 'N/A'
      : Number(score).toFixed(3) + (scale ? ` / ${scale}` : '');
  } catch (err) {
    return score ?? 'N/A';
  }
};

export const formatExtensions = (extensions: string[]) =>
  extensions.map((ext: string) => `.${ext}`).join(', ');
export const countWords = (string: string) => string.match(wordPatternGlobalRegex)?.length ?? 0;
export const isValidEmail = (string: string) => isEmailRegex.test(string);
export function generateUUID() {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
