import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

const icon_png = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.png`} />
);

export const navData = [
  {
    title: 'Siswa',
    path: '/',
    icon: icon('ic-user'),
  },
  {
    title: 'Scratch Game',
    path: 'https://scratch-bangun-datar.vercel.app/',
    icon: icon_png('ic-games'),
  },
];
