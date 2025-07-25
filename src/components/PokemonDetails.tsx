import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PokemonTypeChip } from './PokemonTypeChip';
import { PokemonStats } from './PokemonStats';
import { PokemonEvolution } from './PokemonEvolution';
import { usePokemonDetails } from '@/hooks/usePokemon';
import { Loader2, Weight, Ruler, Star } from 'lucide-react';

interface PokemonDetailsProps {
  pokemonName: string;
  isOpen: boolean;
  onClose: () => void;
  onPokemonClick?: (name: string) => void;
}

export function PokemonDetails({ 
  pokemonName, 
  isOpen, 
  onClose, 
  onPokemonClick 
}: PokemonDetailsProps) {
  const { pokemon, species, evolutionChain, isLoading, error } = usePokemonDetails(pokemonName);

  const description = species?.flavor_text_entries
    ?.find(entry => entry.language.name === 'en')
    ?.flavor_text
    ?.replace(/\f/g, ' ')
    ?.replace(/\n/g, ' ') || 'No description available.';

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <p className="text-destructive">Error loading Pokémon details</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading || !pokemon ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="text-2xl font-bold capitalize">{pokemon.name}</span>
                <Badge variant="outline" className="text-sm">
                  #{pokemon.id.toString().padStart(3, '0')}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            {/* Layout inspirado na imagem de referência */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna esquerda - Imagem do Pokémon */}
              <div className="lg:col-span-1 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/30 flex items-center justify-center">
                    <img
                      src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="w-56 h-56 object-contain"
                    />
                  </div>
                  {/* Pokeball pequena no canto */}
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-muted border-2 border-primary/50 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary/70"></div>
                  </div>
                </div>
              </div>

              {/* Coluna central - Informações principais */}
              <div className="lg:col-span-1 space-y-4">
                {/* Name Section */}
                <div className="bg-card border border-primary/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">Name</h3>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {pokemon.types.map((type, index) => (
                        <span key={type.type.name} className="text-sm text-muted-foreground">
                          Type {index + 1}: <PokemonTypeChip type={type.type.name} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dex Entry */}
                <div className="bg-card border border-primary/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">Dex entry</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Size Comparison */}
                <div className="bg-card border border-primary/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">Size comp.</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">HT: {(pokemon.height / 10).toFixed(1)}m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">WT: {(pokemon.weight / 10).toFixed(1)}kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna direita - Stats e Abilities */}
              <div className="lg:col-span-1 space-y-4">
                {/* Ability */}
                <div className="bg-card border border-primary/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">Ability</h3>
                  <div className="space-y-2">
                    {pokemon.abilities.map((ability) => (
                      <div 
                        key={ability.ability.name}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium capitalize text-foreground">
                          {ability.ability.name.replace('-', ' ')}
                        </span>
                        {ability.is_hidden && (
                          <Badge variant="secondary" className="text-xs">
                            Hidden
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-card border border-primary/20 rounded-lg p-4">
                  <PokemonStats stats={pokemon.stats} />
                </div>
              </div>
            </div>

            {/* Evolution Chain na parte inferior */}
            <div className="mt-8">
              {evolutionChain ? (
                <div className="bg-card border border-primary/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-foreground mb-4">Evolution Chain</h3>
                  <PokemonEvolution 
                    evolutionChain={evolutionChain} 
                    onPokemonClick={onPokemonClick}
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Evolution data not available</p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}