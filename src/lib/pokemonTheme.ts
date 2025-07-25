export function getPokemonTypeTheme(primaryType: string) {
  const typeThemes = {
    fire: {
      background: 'bg-gradient-to-br from-orange-500/10 via-red-500/5 to-orange-400/10',
      cardBg: 'bg-orange-50/80 dark:bg-orange-950/20',
      border: 'border-orange-200/50 dark:border-orange-800/30',
      imageBg: 'bg-gradient-to-br from-orange-400/20 to-red-400/10',
      imageBorder: 'border-orange-400/40'
    },
    water: {
      background: 'bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-blue-400/10',
      cardBg: 'bg-blue-50/80 dark:bg-blue-950/20',
      border: 'border-blue-200/50 dark:border-blue-800/30',
      imageBg: 'bg-gradient-to-br from-blue-400/20 to-cyan-400/10',
      imageBorder: 'border-blue-400/40'
    },
    grass: {
      background: 'bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-400/10',
      cardBg: 'bg-green-50/80 dark:bg-green-950/20',
      border: 'border-green-200/50 dark:border-green-800/30',
      imageBg: 'bg-gradient-to-br from-green-400/20 to-emerald-400/10',
      imageBorder: 'border-green-400/40'
    },
    electric: {
      background: 'bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-yellow-400/10',
      cardBg: 'bg-yellow-50/80 dark:bg-yellow-950/20',
      border: 'border-yellow-200/50 dark:border-yellow-800/30',
      imageBg: 'bg-gradient-to-br from-yellow-400/20 to-amber-400/10',
      imageBorder: 'border-yellow-400/40'
    },
    psychic: {
      background: 'bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-400/10',
      cardBg: 'bg-purple-50/80 dark:bg-purple-950/20',
      border: 'border-purple-200/50 dark:border-purple-800/30',
      imageBg: 'bg-gradient-to-br from-purple-400/20 to-pink-400/10',
      imageBorder: 'border-purple-400/40'
    },
    ice: {
      background: 'bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-cyan-400/10',
      cardBg: 'bg-cyan-50/80 dark:bg-cyan-950/20',
      border: 'border-cyan-200/50 dark:border-cyan-800/30',
      imageBg: 'bg-gradient-to-br from-cyan-400/20 to-sky-400/10',
      imageBorder: 'border-cyan-400/40'
    },
    dragon: {
      background: 'bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-violet-400/10',
      cardBg: 'bg-violet-50/80 dark:bg-violet-950/20',
      border: 'border-violet-200/50 dark:border-violet-800/30',
      imageBg: 'bg-gradient-to-br from-violet-400/20 to-indigo-400/10',
      imageBorder: 'border-violet-400/40'
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-600/10 via-slate-600/5 to-gray-500/10',
      cardBg: 'bg-gray-50/80 dark:bg-gray-950/20',
      border: 'border-gray-200/50 dark:border-gray-800/30',
      imageBg: 'bg-gradient-to-br from-gray-500/20 to-slate-500/10',
      imageBorder: 'border-gray-500/40'
    },
    fairy: {
      background: 'bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-pink-400/10',
      cardBg: 'bg-pink-50/80 dark:bg-pink-950/20',
      border: 'border-pink-200/50 dark:border-pink-800/30',
      imageBg: 'bg-gradient-to-br from-pink-400/20 to-rose-400/10',
      imageBorder: 'border-pink-400/40'
    },
    fighting: {
      background: 'bg-gradient-to-br from-red-600/10 via-orange-600/5 to-red-500/10',
      cardBg: 'bg-red-50/80 dark:bg-red-950/20',
      border: 'border-red-200/50 dark:border-red-800/30',
      imageBg: 'bg-gradient-to-br from-red-500/20 to-orange-500/10',
      imageBorder: 'border-red-500/40'
    },
    poison: {
      background: 'bg-gradient-to-br from-purple-600/10 via-violet-600/5 to-purple-500/10',
      cardBg: 'bg-purple-50/80 dark:bg-purple-950/20',
      border: 'border-purple-200/50 dark:border-purple-800/30',
      imageBg: 'bg-gradient-to-br from-purple-500/20 to-violet-500/10',
      imageBorder: 'border-purple-500/40'
    },
    ground: {
      background: 'bg-gradient-to-br from-amber-600/10 via-yellow-600/5 to-amber-500/10',
      cardBg: 'bg-amber-50/80 dark:bg-amber-950/20',
      border: 'border-amber-200/50 dark:border-amber-800/30',
      imageBg: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10',
      imageBorder: 'border-amber-500/40'
    },
    flying: {
      background: 'bg-gradient-to-br from-sky-500/10 via-blue-400/5 to-sky-400/10',
      cardBg: 'bg-sky-50/80 dark:bg-sky-950/20',
      border: 'border-sky-200/50 dark:border-sky-800/30',
      imageBg: 'bg-gradient-to-br from-sky-400/20 to-blue-400/10',
      imageBorder: 'border-sky-400/40'
    },
    bug: {
      background: 'bg-gradient-to-br from-lime-600/10 via-green-600/5 to-lime-500/10',
      cardBg: 'bg-lime-50/80 dark:bg-lime-950/20',
      border: 'border-lime-200/50 dark:border-lime-800/30',
      imageBg: 'bg-gradient-to-br from-lime-500/20 to-green-500/10',
      imageBorder: 'border-lime-500/40'
    },
    rock: {
      background: 'bg-gradient-to-br from-stone-600/10 via-amber-700/5 to-stone-500/10',
      cardBg: 'bg-stone-50/80 dark:bg-stone-950/20',
      border: 'border-stone-200/50 dark:border-stone-800/30',
      imageBg: 'bg-gradient-to-br from-stone-500/20 to-amber-600/10',
      imageBorder: 'border-stone-500/40'
    },
    ghost: {
      background: 'bg-gradient-to-br from-indigo-600/10 via-purple-700/5 to-indigo-500/10',
      cardBg: 'bg-indigo-50/80 dark:bg-indigo-950/20',
      border: 'border-indigo-200/50 dark:border-indigo-800/30',
      imageBg: 'bg-gradient-to-br from-indigo-500/20 to-purple-600/10',
      imageBorder: 'border-indigo-500/40'
    },
    steel: {
      background: 'bg-gradient-to-br from-slate-500/10 via-gray-500/5 to-slate-400/10',
      cardBg: 'bg-slate-50/80 dark:bg-slate-950/20',
      border: 'border-slate-200/50 dark:border-slate-800/30',
      imageBg: 'bg-gradient-to-br from-slate-400/20 to-gray-400/10',
      imageBorder: 'border-slate-400/40'
    },
    normal: {
      background: 'bg-gradient-to-br from-neutral-400/10 via-stone-400/5 to-neutral-300/10',
      cardBg: 'bg-neutral-50/80 dark:bg-neutral-950/20',
      border: 'border-neutral-200/50 dark:border-neutral-800/30',
      imageBg: 'bg-gradient-to-br from-neutral-300/20 to-stone-300/10',
      imageBorder: 'border-neutral-300/40'
    }
  };

  return typeThemes[primaryType as keyof typeof typeThemes] || typeThemes.normal;
}