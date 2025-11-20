'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/project-card';
import { FundProjectDialog } from '@/components/fund-project-dialog';
import { campaignsApi } from '@/lib/services/api/campaigns';
import { Campaign } from '@/lib/types';
import { Heart } from 'lucide-react';

export default function Home() {
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
    <div className="min-h-screen bg-background pb-20">
      <main className="px-4 pt-6">
        {/* Título simple */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Campañas
          </h1>
          <p className="text-sm text-muted-foreground">
            Apoyá campañas increíbles
          </p>
        </div>

        {/* Lista de Campañas */}
        {loading ? (
          <div className="text-center py-16 px-4">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-sm mx-auto">
              <p className="text-sm text-muted-foreground">Cargando campañas...</p>
            </div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-sm mx-auto">
              <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No hay campañas</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Sé el primero en crear una campaña
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
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
