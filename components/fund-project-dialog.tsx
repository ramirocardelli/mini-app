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
import { Project } from '@/lib/types';
import { updateProject } from '@/lib/storage';
import { lemonSDK } from '@/lib/lemon-sdk-mock';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface FundProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function FundProjectDialog({ project, open, onOpenChange, onSuccess }: FundProjectDialogProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFund = async () => {
    if (!project) return;

    const fundAmount = parseFloat(amount);

    if (isNaN(fundAmount) || fundAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid funding amount',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Process payment using Lemon SDK
      const paymentResponse = await lemonSDK.makePayment(fundAmount, project.creatorAddress);

      if (!paymentResponse.success) {
        toast({
          title: 'Payment Failed',
          description: paymentResponse.error || 'Failed to process payment',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Update project with new funding
      const newAmount = project.currentAmount + fundAmount;
      updateProject(project.id, { currentAmount: newAmount });

      toast({
        title: 'Success!',
        description: `You've funded $${fundAmount.toFixed(2)} to ${project.title}`,
      });

      setAmount('');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process funding. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const remaining = project ? project.goalAmount - project.currentAmount : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Fund Project</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {project?.title}
          </DialogDescription>
        </DialogHeader>

        {project && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current:</span>
                <span className="text-secondary font-semibold">${project.currentAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Goal:</span>
                <span className="text-foreground">${project.goalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Remaining:</span>
                <span className="text-foreground">${remaining.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">Funding Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10.00"
                className="bg-input text-foreground border-border"
                autoFocus
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-md border border-border">
              <p className="text-xs text-muted-foreground break-all">
                <span className="font-semibold text-foreground">Recipient:</span> {project.creatorAddress}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full border-border text-foreground hover:bg-muted"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFund}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              'Confirm Funding'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
