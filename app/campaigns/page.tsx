'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/project-card';
import { FundProjectDialog } from '@/components/fund-project-dialog';
import { Campaign } from '@/lib/types';
import { campaignsApi } from '@/lib/services/api/campaigns';
import { Plus, Wallet, ArrowLeft } from 'lucide-react';

export default function ProjectsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showFundDialog, setShowFundDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignsApi.getAll();
      if (response.success) {
        setCampaigns(response.data || []);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFundCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowFundDialog(true);
  };

  const handleFundSuccess = () => {
    loadCampaigns();
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance mb-2">
            Todas las Campañas
          </h2>
          <p className="text-sm text-muted-foreground">
            Descubre campañas increíbles y apóyalas con LemonCash
          </p>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="text-center py-16 px-4">
            <div className="bg-card border border-border rounded-lg p-8 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground">Cargando campañas...</p>
            </div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-card border border-border rounded-lg p-8 max-w-md mx-auto">
              <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Hay Campañas</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Aún no hay campañas disponibles. ¡Sé el primero en crear una!
              </p>
              <Link href="/campaigns/new">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Campaña
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <ProjectCard
                key={campaign.id}
                project={campaign}
                onFund={handleFundCampaign}
              />
            ))}
          </div>
        )}
      </main>

      {/* Fund Dialog */}
      <FundProjectDialog
        campaign={selectedCampaign}
        open={showFundDialog}
        onOpenChange={setShowFundDialog}
        onSuccess={handleFundSuccess}
      />
    </div>
  );
}

