import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PokemonTypeChipProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

const typeColors: Record<string, string> = {
  fire: 'bg-pokemon-fire text-white',
  water: 'bg-pokemon-water text-white',
  grass: 'bg-pokemon-grass text-white',
  electric: 'bg-pokemon-electric text-foreground',
  psychic: 'bg-pokemon-psychic text-white',
  ice: 'bg-pokemon-ice text-foreground',
  dragon: 'bg-pokemon-dragon text-white',
  dark: 'bg-pokemon-dark text-white',
  fairy: 'bg-pokemon-fairy text-foreground',
  fighting: 'bg-pokemon-fighting text-white',
  poison: 'bg-pokemon-poison text-white',
  ground: 'bg-pokemon-ground text-white',
  flying: 'bg-pokemon-flying text-foreground',
  bug: 'bg-pokemon-bug text-white',
  rock: 'bg-pokemon-rock text-white',
  ghost: 'bg-pokemon-ghost text-white',
  steel: 'bg-pokemon-steel text-white',
  normal: 'bg-pokemon-normal text-foreground',
};

export function PokemonTypeChip({ type, size = 'md' }: PokemonTypeChipProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <Badge
      className={cn(
        'capitalize font-medium border-0 shadow-sm',
        typeColors[type] || 'bg-pokemon-normal text-foreground',
        sizeClasses[size]
      )}
    >
      {type}
    </Badge>
  );
}