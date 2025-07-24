import { Progress } from '@/components/ui/progress';
import { PokemonStat } from '@/types/pokemon';

interface PokemonStatsProps {
  stats: PokemonStat[];
}

const statNames: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

const statColors: Record<string, string> = {
  hp: 'bg-red-500',
  attack: 'bg-orange-500',
  defense: 'bg-blue-500',
  'special-attack': 'bg-purple-500',
  'special-defense': 'bg-green-500',
  speed: 'bg-yellow-500',
};

export function PokemonStats({ stats }: PokemonStatsProps) {
  const maxStat = 255; // Valor máximo teórico para uma stat

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Base Stats</h3>
      <div className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.stat.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground capitalize">
                {statNames[stat.stat.name] || stat.stat.name}
              </span>
              <span className="text-sm font-bold text-primary">
                {stat.base_stat}
              </span>
            </div>
            <Progress
              value={(stat.base_stat / maxStat) * 100}
              className="h-2"
            />
          </div>
        ))}
        
        {/* Total */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-foreground">Total</span>
            <span className="text-sm font-bold text-primary">
              {stats.reduce((total, stat) => total + stat.base_stat, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}