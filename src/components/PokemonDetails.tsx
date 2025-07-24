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

            <div className="space-y-6">
              {/* Header com imagem e informações básicas */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
                    <img
                      src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                  {/* Tipos */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {pokemon.types.map((type) => (
                      <PokemonTypeChip key={type.type.name} type={type.type.name} />
                    ))}
                  </div>

                  {/* Descrição */}
                  <p className="text-muted-foreground leading-relaxed">
                    {description}
                  </p>

                  {/* Informações físicas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Ruler className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Height:</strong> {(pokemon.height / 10).toFixed(1)}m
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Weight className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Weight:</strong> {(pokemon.weight / 10).toFixed(1)}kg
                      </span>
                    </div>
                  </div>

                  {/* Experiência base */}
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Base Experience:</strong> {pokemon.base_experience}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs com detalhes */}
              <Tabs defaultValue="stats" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="abilities">Abilities</TabsTrigger>
                  <TabsTrigger value="evolution">Evolution</TabsTrigger>
                </TabsList>

                <TabsContent value="stats" className="mt-6">
                  <PokemonStats stats={pokemon.stats} />
                </TabsContent>

                <TabsContent value="abilities" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Abilities</h3>
                    <div className="grid gap-3">
                      {pokemon.abilities.map((ability) => (
                        <div 
                          key={ability.ability.name}
                          className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                        >
                          <span className="font-medium capitalize text-foreground">
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
                </TabsContent>

                <TabsContent value="evolution" className="mt-6">
                  {evolutionChain ? (
                    <PokemonEvolution 
                      evolutionChain={evolutionChain} 
                      onPokemonClick={onPokemonClick}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Evolution data not available</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}