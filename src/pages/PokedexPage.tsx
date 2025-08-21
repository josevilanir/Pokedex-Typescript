import { PokemonList } from '@/components/PokemonList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PokedexPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const generation = searchParams.get('gen');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  const generationNames: Record<string, string> = {
    '1': 'Generation I - Kanto',
    '2': 'Generation II - Johto', 
    '3': 'Generation III - Hoenn',
    '4': 'Generation IV - Sinnoh',
    '5': 'Generation V - Unova',
    '6': 'Generation VI - Kalos',
    '7': 'Generation VII - Alola',
    '8': 'Generation VIII - Galar',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <div className="relative py-12 px-4 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-6 hover:scale-105 transition-transform duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Generations
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {generation ? generationNames[generation] : 'Pokédex'}
            </h1>
            {start && end && (
              <p className="text-lg md:text-xl text-muted-foreground">
                Pokémon #{start} - #{end}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Pokemon List */}
      <PokemonList 
        generationFilter={generation ? parseInt(generation) : undefined}
        startRange={start ? parseInt(start) : undefined}
        endRange={end ? parseInt(end) : undefined}
      />
    </div>
  );
};

export default PokedexPage;