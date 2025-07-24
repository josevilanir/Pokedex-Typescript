import { Card, CardContent } from '@/components/ui/card';
import { PokemonTypeChip } from './PokemonTypeChip';
import { Pokemon } from '@/types/pokemon';
import { cn } from '@/lib/utils';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: () => void;
  className?: string;
}

export function PokemonCard({ pokemon, onClick, className }: PokemonCardProps) {
  const mainType = pokemon.types[0]?.type.name || 'normal';
  
  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg',
        'border-2 border-border/50 hover:border-primary/30',
        'bg-gradient-to-br from-card to-muted/20',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="text-center">
          {/* Número do Pokémon */}
          <div className="text-xs font-medium text-muted-foreground mb-2">
            #{pokemon.id.toString().padStart(3, '0')}
          </div>
          
          {/* Imagem do Pokémon */}
          <div className="relative mb-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center mb-2">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-20 h-20 object-contain group-hover:animate-pokemon-bounce transition-transform"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Nome do Pokémon */}
          <h3 className="font-bold text-lg capitalize text-foreground mb-3 group-hover:text-primary transition-colors">
            {pokemon.name}
          </h3>
          
          {/* Tipos do Pokémon */}
          <div className="flex flex-wrap gap-2 justify-center">
            {pokemon.types.map((type) => (
              <PokemonTypeChip 
                key={type.type.name} 
                type={type.type.name} 
                size="sm"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}