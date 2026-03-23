import Link from 'next/link';

type Props = {
  href: string;
  label: string;
  active?: boolean;
  side?: 'first' | 'middle' | 'last';
};

export default function HexNavButton({ href, label, active, side = 'middle' }: Props) {
  const base = 'inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white transition-all';
  const bg = active ? 'bg-red-900/90' : 'bg-black/80 hover:bg-red-900/80';
  let clip = 'clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)';
  if (side === 'first') clip = 'clip-path: polygon(0 20%, 90% 0, 100% 50%, 90% 100%, 0 80%, 0 50%)';
  if (side === 'last') clip = 'clip-path: polygon(0 50%, 10% 0, 100% 20%, 100% 80%, 10% 100%, 0 50%)';

  return (
    <Link href={href} className={`${base} ${bg}`} style={{ clipPath: clip }}>
      {label}
    </Link>
  );
}
