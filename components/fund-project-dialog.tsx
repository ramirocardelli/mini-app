'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Campaign, Donation } from '@/lib/types';
import { authenticate, deposit, TransactionResult, TokenName } from '@/lib/lemon-sdk-mock';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface FundProjectDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function FundProjectDialog({ campaign, open, onOpenChange, onSuccess }: FundProjectDialogProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFund = async () => {
    if (!campaign) return;

    const fundAmount = parseFloat(amount);

    if (isNaN(fundAmount) || fundAmount <= 0) {
      toast({
        title: 'Monto Inválido',
        description: 'Por favor ingresá un monto válido',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Authenticate to get donor's wallet address
      const authResult = await authenticate();
      
      if (authResult.result !== TransactionResult.SUCCESS || !authResult.data) {
        toast({
          title: 'Autenticación Fallida',
          description: 'No se pudo autenticar tu billetera. Por favor intentá nuevamente.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      const donorAddress = authResult.data.wallet;

      // Process payment using Lemon SDK
      const paymentResponse = await deposit({
        amount: fundAmount.toString(),
        tokenName: TokenName.USDC,
      });

      if (paymentResponse.result === TransactionResult.CANCELLED) {
        toast({
          title: 'Pago Cancelado',
          description: 'Cancelaste el pago',
        });
        setLoading(false);
        return;
      }

      if (paymentResponse.result !== TransactionResult.SUCCESS) {
        toast({
          title: 'Pago Fallido',
          description: 'El pago no se pudo completar. Por favor intentá nuevamente.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Get or create user
      let userId: string;
      try {
        const userResponse = await fetch('/api/users/by-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: donorAddress }),
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to get/create user');
        }
        
        const userData = await userResponse.json();
        userId = userData.data.id;
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo procesar tu usuario. Por favor intentá nuevamente.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Create donation via API
      const donationResponse = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          campaignId: campaign.id,
          amount: fundAmount,
          token: 'USDC',
          paymentId: paymentResponse.data?.txHash || `payment_${Date.now()}`,
        }),
      });

      if (!donationResponse.ok) {
        const errorData = await donationResponse.json();
        throw new Error(errorData.error || 'Failed to create donation');
      }

      const donationData = await donationResponse.json();

      // Actualizar el monto actual de la campaña
      try {
        await fetch(`/api/campaigns/${campaign.id}/add-funds`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: fundAmount }),
        });
      } catch (updateError) {
        console.error('Error updating campaign funds:', updateError);
        // No bloquear el flujo si falla la actualización
      }

      toast({
        title: 'Donación Exitosa',
        description: `Donaste $${fundAmount.toFixed(2)} USDC a ${campaign.title}`,
      });

      setAmount('');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al procesar el pago. Por favor intentá nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const remaining = campaign ? campaign.goalAmount - campaign.currentAmount : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Apoyar Campaña</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            {campaign?.title}
          </DialogDescription>
        </DialogHeader>

        {campaign && (
          <div className="space-y-5 py-4">
            <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Actual</span>
                <span className="text-base font-semibold text-secondary">
                  ${campaign.currentAmount.toFixed(0)} USDC
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Meta</span>
                <span className="text-base font-medium text-foreground">
                  ${campaign.goalAmount.toFixed(0)} USDC
                </span>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Falta</span>
                  <span className="text-lg font-bold text-foreground">
                    ${remaining.toFixed(0)} USDC
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="amount" className="text-foreground text-sm font-medium">
                Monto a aportar
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="bg-input text-foreground border-border h-14 text-xl pl-4 pr-16 font-semibold"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                  USDC
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-3 sm:gap-3">
          <Button
            onClick={handleFund}
            className="w-full h-12 bg-secondary text-black hover:bg-secondary/90 font-semibold text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Procesando...
              </>
            ) : (
              'Confirmar Aporte'
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-muted-foreground hover:text-foreground hover:bg-transparent"
            disabled={loading}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
