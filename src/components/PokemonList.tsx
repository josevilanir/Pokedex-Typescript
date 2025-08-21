import { useState, useEffect, useRef } from 'react';
import { PokemonCard } from './PokemonCard';
import { PokemonDetails } from './PokemonDetails';
import { PokemonTypeFilter } from './PokemonTypeFilter';
import { usePokemonList } from '@/hooks/usePokemon';
import { pokemonApi } from '@/services/pokemonApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';

interface PokemonListProps {
  generationFilter?: number;
  startRange?: number;
  endRange?: number;
}

export function PokemonList({ generationFilter, startRange, endRange }: PokemonListProps = {}) {
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const pokemonDataRef = useRef<Pokemon[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = usePokemonList(20);

  // Atualizar ref quando pokemonData muda
  useEffect(() => {
    pokemonDataRef.current = pokemonData;
  }, [pokemonData]);

  // Buscar dados detalhados dos pokémon
  useEffect(() => {
    if (data?.pages) {
      let allPokemon = data.pages.flatMap(page => page.results);
      
      // Filter by generation range if specified
      if (startRange && endRange) {
        allPokemon = allPokemon.filter(pokemon => {
          const pokemonId = parseInt(pokemon.url.split('/').slice(-2, -1)[0]);
          return pokemonId >= startRange && pokemonId <= endRange;
        });
      }
      
      // Só buscar pokémon que ainda não temos
      const newPokemon = allPokemon.filter(pokemon => 
        !pokemonDataRef.current.some(existing => existing.name === pokemon.name)
      );
      
      if (newPokemon.length > 0) {
        Promise.all(
          newPokemon.map(pokemon => pokemonApi.getPokemon(pokemon.name))
        ).then(newPokemonDetails => {
          setPokemonData(prev => [...prev, ...newPokemonDetails]);
        });
      }
    }
  }, [data?.pages?.length, startRange, endRange]);

  // Filtrar pokémon por busca e tipo
  const filteredPokemon = pokemonData.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.id.toString().includes(searchTerm);
    
    const matchesType = selectedType === 'all' || 
      pokemon.types.some(type => type.type.name === selectedType);
    
    return matchesSearch && matchesType;
  });

  const handlePokemonClick = (pokemonName: string) => {
    setSelectedPokemon(pokemonName);
  };

  // Funções de navegação
  const getCurrentPokemonIndex = () => {
    if (!selectedPokemon) return -1;
    return pokemonData.findIndex(p => p.name === selectedPokemon);
  };

  const handleNavigatePrevious = () => {
    const currentIndex = getCurrentPokemonIndex();
    if (currentIndex > 0) {
      setSelectedPokemon(pokemonData[currentIndex - 1].name);
    }
  };

  const handleNavigateNext = () => {
    const currentIndex = getCurrentPokemonIndex();
    if (currentIndex < pokemonData.length - 1) {
      setSelectedPokemon(pokemonData[currentIndex + 1].name);
    }
  };

  const canNavigatePrevious = getCurrentPokemonIndex() > 0;
  const canNavigateNext = getCurrentPokemonIndex() < pokemonData.length - 1;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-destructive text-lg">Error loading Pokémon data</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search Pokémon by name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <PokemonTypeFilter
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </div>

      {/* Loading inicial */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading Pokémon...</p>
          </div>
        </div>
      )}

      {/* Grid de Pokémon */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {filteredPokemon.map((pokemon) => (
              <div key={pokemon.id} className="animate-fade-in">
                <PokemonCard
                  pokemon={pokemon}
                  onClick={() => handlePokemonClick(pokemon.name)}
                />
              </div>
            ))}
          </div>

          {/* Botão carregar mais - Only show if not filtering by generation */}
          {hasNextPage && !searchTerm && selectedType === 'all' && !generationFilter && (
            <div className="text-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary text-white shadow-lg"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Pokémon'
                )}
              </Button>
            </div>
          )}

          {/* Mensagem quando nenhum pokémon é encontrado */}
          {(searchTerm || selectedType !== 'all') && filteredPokemon.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No Pokémon found matching your filters
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal de detalhes */}
      {selectedPokemon && (
      <PokemonDetails
        pokemonName={selectedPokemon}
        isOpen={!!selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        onPokemonClick={handlePokemonClick}
        onNavigatePrevious={handleNavigatePrevious}
        onNavigateNext={handleNavigateNext}
        canNavigatePrevious={canNavigatePrevious}
        canNavigateNext={canNavigateNext}
      />
      )}
    </div>
  );
}