import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const generations = [
  {
    id: 1,
    name: 'Generation I',
    region: 'Kanto',
    pokemonRange: '1-151',
    description: 'The original 150 Pokémon that started it all',
    gradient: 'from-red-500/20 via-yellow-500/10 to-orange-500/20',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-600',
    accentColor: 'bg-red-500',
  },
  {
    id: 2,
    name: 'Generation II',
    region: 'Johto',
    pokemonRange: '152-251',
    description: 'Gold, Silver & Crystal introduced 100 new Pokémon',
    gradient: 'from-yellow-500/20 via-amber-500/10 to-gold-500/20',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-600',
    accentColor: 'bg-yellow-500',
  },
  {
    id: 3,
    name: 'Generation III',
    region: 'Hoenn',
    pokemonRange: '252-386',
    description: 'Ruby, Sapphire & Emerald with abilities system',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-600',
    accentColor: 'bg-emerald-500',
  },
  {
    id: 4,
    name: 'Generation IV',
    region: 'Sinnoh',
    pokemonRange: '387-493',
    description: 'Diamond, Pearl & Platinum with physical/special split',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-600',
    accentColor: 'bg-blue-500',
  },
  {
    id: 5,
    name: 'Generation V',
    region: 'Unova',
    pokemonRange: '494-649',
    description: 'Black & White with only new Pokémon until postgame',
    gradient: 'from-gray-500/20 via-slate-500/10 to-zinc-500/20',
    borderColor: 'border-gray-500/30',
    textColor: 'text-gray-600',
    accentColor: 'bg-gray-500',
  },
  {
    id: 6,
    name: 'Generation VI',
    region: 'Kalos',
    pokemonRange: '650-721',
    description: 'X & Y introduced 3D graphics and Fairy type',
    gradient: 'from-pink-500/20 via-rose-500/10 to-fuchsia-500/20',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-600',
    accentColor: 'bg-pink-500',
  },
  {
    id: 7,
    name: 'Generation VII',
    region: 'Alola',
    pokemonRange: '722-809',
    description: 'Sun & Moon with Z-Moves and regional variants',
    gradient: 'from-orange-500/20 via-amber-500/10 to-yellow-500/20',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-600',
    accentColor: 'bg-orange-500',
  },
  {
    id: 8,
    name: 'Generation VIII',
    region: 'Galar',
    pokemonRange: '810-905',
    description: 'Sword & Shield with Dynamax and Wild Area',
    gradient: 'from-violet-500/20 via-purple-500/10 to-indigo-500/20',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-600',
    accentColor: 'bg-violet-500',
  },
];

const GenerationSelect = () => {
  const navigate = useNavigate();

  const handleGenerationSelect = (generation: typeof generations[0]) => {
    const [start, end] = generation.pokemonRange.split('-').map(Number);
    navigate(`/pokedex?gen=${generation.id}&start=${start}&end=${end}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Choose Your Generation
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Explore Pokémon from different generations and discover their unique worlds
          </p>
        </div>
      </div>

      {/* Generation Cards */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {generations.map((generation, index) => (
            <Card
              key={generation.id}
              className={`group relative overflow-hidden border-2 ${generation.borderColor} bg-gradient-to-br ${generation.gradient} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer animate-fade-in`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => handleGenerationSelect(generation)}
            >
              {/* Accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${generation.accentColor}`} />
              
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-3 h-3 rounded-full ${generation.accentColor} animate-pulse`} />
                  <ChevronRight className={`w-5 h-5 ${generation.textColor} opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:transform group-hover:translate-x-1`} />
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${generation.textColor} mb-2`}>
                    {generation.name}
                  </h3>
                  <p className="text-base font-semibold text-foreground/80 mb-3">
                    {generation.region}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {generation.description}
                  </p>
                </div>
                
                <div className="mt-auto">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${generation.accentColor} text-white`}>
                    Pokémon #{generation.pokemonRange}
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenerationSelect;