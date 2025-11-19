'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreateProjectForm } from '@/components/create-project-form';
import { ProjectCard } from '@/components/project-card';
import { FundProjectDialog } from '@/components/fund-project-dialog';
import { Project } from '@/lib/types';
import { getProjects } from '@/lib/storage';
import { lemonSDK } from '@/lib/lemon-sdk-mock';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, Plus, Wallet } from 'lucide-react';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFundDialog, setShowFundDialog] = useState(false);

  // Authenticate on mount
  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await lemonSDK.authenticate();
        
        if (response.success) {
          setAuthenticated(true);
          setAuthError(null);
          loadProjects();
        } else {
          setAuthError(response.error || 'Authentication failed');
        }
      } catch (error) {
        setAuthError('Failed to connect to LemonCash. Please try again later.');
      } finally {
        setAuthLoading(false);
      }
    };

    authenticate();
  }, []);

  const loadProjects = () => {
    setProjects(getProjects());
  };

  const handleCreateProject = () => {
    setShowCreateForm(false);
    loadProjects();
  };

  const handleFundProject = (project: Project) => {
    setSelectedProject(project);
    setShowFundDialog(true);
  };

  const handleFundSuccess = () => {
    loadProjects();
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 text-secondary mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Connecting to LemonCash</h2>
            <p className="text-sm text-muted-foreground mt-2">Authenticating your session...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {authError}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.location.reload()}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-secondary rounded-lg p-2">
                <Wallet className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">LemonFund</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Crowdfunding powered by LemonCash</p>
              </div>
            </div>
            
            {authenticated && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border border-border">
                  <div className="h-2 w-2 bg-secondary rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">Connected</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Create Project Section */}
        {showCreateForm ? (
          <div className="mb-8 max-w-2xl mx-auto">
            <CreateProjectForm
              onSuccess={handleCreateProject}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        ) : (
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">Browse Projects</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Support innovative projects or create your own
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {!showCreateForm && (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="bg-card border border-border rounded-lg p-8 max-w-md mx-auto">
                  <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Yet</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Be the first to create a crowdfunding project on LemonFund!
                  </p>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Project
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onFund={handleFundProject}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Fund Dialog */}
      <FundProjectDialog
        project={selectedProject}
        open={showFundDialog}
        onOpenChange={setShowFundDialog}
        onSuccess={handleFundSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Built with LemonCash SDK • Mock mode for development
          </p>
        </div>
      </footer>
    </div>
  );
}
