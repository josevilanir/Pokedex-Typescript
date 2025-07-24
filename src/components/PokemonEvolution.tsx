import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '@/services/pokemonApi';
import { EvolutionChain, EvolutionLink } from '@/types/pokemon';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PokemonEvolutionProps {
  evolutionChain: EvolutionChain;
  onPokemonClick?: (name: string) => void;
}

interface EvolutionStepProps {
  evolution: EvolutionLink;
  onPokemonClick?: (name: string) => void;
}

function EvolutionStep({ evolution, onPokemonClick }: EvolutionStepProps) {
  const pokemonId = pokemonApi.extractIdFromUrl(evolution.species.url);
  
  const { data: pokemon, isLoading } = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => pokemonApi.getPokemon(pokemonId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-24 h-24">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div className="flex flex-col items-center space-y-2">
      <Card 
        className={cn(
          "w-20 h-20 cursor-pointer transition-all duration-300 hover:scale-110",
          "border-2 border-border hover:border-primary/50 bg-gradient-to-br from-card to-muted/20"
        )}
        onClick={() => onPokemonClick?.(pokemon.name)}
      >
        <CardContent className="p-2 flex items-center justify-center h-full">
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-full h-full object-contain"
          />
        </CardContent>
      </Card>
      
      <div className="text-center">
        <p className="text-xs font-medium capitalize text-foreground">
          {pokemon.name}
        </p>
        <p className="text-xs text-muted-foreground">
          #{pokemon.id.toString().padStart(3, '0')}
        </p>
      </div>
    </div>
  );
}

function renderEvolutionChain(
  evolution: EvolutionLink,
  onPokemonClick?: (name: string) => void
): JSX.Element[] {
  const elements: JSX.Element[] = [];
  
  // Adiciona o pokémon atual
  elements.push(
    <EvolutionStep
      key={evolution.species.name}
      evolution={evolution}
      onPokemonClick={onPokemonClick}
    />
  );

  // Se há evoluções, adiciona seta e próximas evoluções
  evolution.evolves_to.forEach((nextEvolution, index) => {
    elements.push(
      <div key={`arrow-${index}`} className="flex items-center justify-center">
        <ChevronRight className="w-6 h-6 text-muted-foreground" />
      </div>
    );
    
    elements.push(...renderEvolutionChain(nextEvolution, onPokemonClick));
  });

  return elements;
}

export function PokemonEvolution({ evolutionChain, onPokemonClick }: PokemonEvolutionProps) {
  const evolutionElements = renderEvolutionChain(evolutionChain.chain, onPokemonClick);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Evolution Chain</h3>
      <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-muted/20 rounded-lg">
        {evolutionElements}
      </div>
    </div>
  );
}