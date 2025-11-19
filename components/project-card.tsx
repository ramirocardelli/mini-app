'use client';

import { Project } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ProjectCardProps {
  project: Project;
  onFund: (project: Project) => void;
}

export function ProjectCard({ project, onFund }: ProjectCardProps) {
  const progress = (project.currentAmount / project.goalAmount) * 100;
  const remaining = project.goalAmount - project.currentAmount;

  return (
    <Card className="bg-card border-border hover:border-secondary transition-colors">
      <CardHeader>
        <CardTitle className="text-foreground text-balance">{project.title}</CardTitle>
        <p className="text-sm text-muted-foreground">by {project.creatorName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground/80 line-clamp-3">{project.description}</p>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary font-semibold">${project.currentAmount.toFixed(2)}</span>
            <span className="text-muted-foreground">Goal: ${project.goalAmount.toFixed(2)}</span>
          </div>
          {remaining > 0 && (
            <p className="text-xs text-muted-foreground">${remaining.toFixed(2)} remaining</p>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground break-all">
            Wallet: {project.creatorAddress.slice(0, 10)}...{project.creatorAddress.slice(-8)}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onFund(project)}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
          disabled={progress >= 100}
        >
          {progress >= 100 ? 'Fully Funded' : 'Fund Project'}
        </Button>
      </CardFooter>
    </Card>
  );
}
