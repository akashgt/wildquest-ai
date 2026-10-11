import React from 'react';
import { 
  Award, 
  Footprints, 
  Eye, 
  HeartHandshake, 
  CalendarCheck, 
  BookOpen, 
  CheckCircle2, 
  Lock,
  Sparkles,
  Leaf
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { useApp } from '../../context/AppContext';

export const AchievementsView: React.FC = () => {
  const { achievements } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-6 h-6" />;
      case 'Eye':
        return <Eye className="w-6 h-6" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-600 font-mono">
              Honest Milestones
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-forest-500" />
            <span className="text-xs text-forest-700">No Guilt Streaks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-forest-900 tracking-tight">
            Outdoor Badges
          </h1>
          <p className="text-sm text-forest-700/90 mt-0.5 max-w-xl">
            Meaningful milestones earned solely through your real outdoor observations and mindfulness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="sunlight" size="md" icon={<Sparkles className="w-3.5 h-3.5 text-forest-800" />}>
            {unlockedCount} of {achievements.length} Unlocked
          </Badge>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {achievements.map(ach => {
          const progressPercent = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));

          return (
            <Card
              key={ach.id}
              variant={ach.isUnlocked ? 'elevated' : 'default'}
              className={`p-6 transition-all ${
                ach.isUnlocked 
                  ? 'border-forest-600/40 shadow-soft-md bg-ivory-50' 
                  : 'opacity-85 bg-ivory-100/60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-soft-sm ${
                  ach.isUnlocked
                    ? 'bg-forest-700 text-sunlight-400'
                    : 'bg-sage-200 text-forest-700/60'
                }`}>
                  {ach.isUnlocked ? getIcon(ach.iconName) : <Lock className="w-6 h-6" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold font-display text-forest-900 truncate">
                      {ach.title}
                    </h3>
                    {ach.isUnlocked ? (
                      <Badge variant="forest" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-forest-600" />}>
                        Unlocked
                      </Badge>
                    ) : (
                      <span className="text-xs font-mono font-semibold text-forest-600">
                        {ach.currentValue}/{ach.targetValue}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-forest-700 leading-relaxed mb-3">
                    {ach.description}
                  </p>

                  <div className="space-y-1">
                    <ProgressBar
                      progress={progressPercent}
                      color={ach.isUnlocked ? 'forest' : 'sage'}
                    />
                    {ach.unlockedAt && (
                      <div className="text-[10px] text-forest-600/70 font-mono text-right">
                        Earned {new Date(ach.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Touch Grass Philosophy note */}
      <div className="p-6 rounded-3xl bg-forest-850 text-ivory-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-700 text-sunlight-400 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-display text-ivory-50">
              No manipulative gamification
            </h4>
            <p className="text-xs text-sage-200 max-w-lg leading-relaxed">
              WildQuest refuses to use push notification pressure or punishing streaks. Nature exists on seasonal time, and every visit outdoors is complete in itself.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
