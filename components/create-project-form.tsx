'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/types';
import { saveProject } from '@/lib/storage';
import { lemonSDK } from '@/lib/lemon-sdk-mock';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface CreateProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateProjectForm({ onSuccess, onCancel }: CreateProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    initialDeposit: '',
    creatorName: '',
    creatorAddress: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const goalAmount = parseFloat(formData.goalAmount);
      const initialDeposit = parseFloat(formData.initialDeposit);

      // Validation
      if (!formData.title || !formData.description || !formData.creatorName || !formData.creatorAddress) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (isNaN(goalAmount) || goalAmount <= 0) {
        toast({
          title: 'Invalid Goal Amount',
          description: 'Please enter a valid goal amount',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (isNaN(initialDeposit) || initialDeposit < 0) {
        toast({
          title: 'Invalid Initial Deposit',
          description: 'Please enter a valid initial deposit amount',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Make initial deposit using Lemon SDK
      if (initialDeposit > 0) {
        const paymentResponse = await lemonSDK.makePayment(initialDeposit, formData.creatorAddress);
        
        if (!paymentResponse.success) {
          toast({
            title: 'Payment Failed',
            description: paymentResponse.error || 'Failed to process initial deposit',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
      }

      // Create project
      const newProject: Project = {
        id: 'project_' + Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        goalAmount,
        currentAmount: initialDeposit,
        creatorAddress: formData.creatorAddress,
        creatorName: formData.creatorName,
        createdAt: new Date(),
      };

      saveProject(newProject);

      toast({
        title: 'Project Created!',
        description: 'Your crowdfunding project has been created successfully',
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Create New Project</CardTitle>
        <CardDescription className="text-muted-foreground">
          Fill in the details to start your crowdfunding campaign
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Awesome Project"
              className="bg-input text-foreground border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project and what you plan to achieve..."
              className="bg-input text-foreground border-border min-h-24"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatorName" className="text-foreground">Your Name *</Label>
            <Input
              id="creatorName"
              value={formData.creatorName}
              onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
              placeholder="John Doe"
              className="bg-input text-foreground border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatorAddress" className="text-foreground">Your Crypto Address *</Label>
            <Input
              id="creatorAddress"
              value={formData.creatorAddress}
              onChange={(e) => setFormData({ ...formData, creatorAddress: e.target.value })}
              placeholder="0x..."
              className="bg-input text-foreground border-border font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">This is where you'll receive the funds</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goalAmount" className="text-foreground">Goal Amount (USD) *</Label>
              <Input
                id="goalAmount"
                type="number"
                step="0.01"
                value={formData.goalAmount}
                onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                placeholder="1000.00"
                className="bg-input text-foreground border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialDeposit" className="text-foreground">Initial Deposit (USD)</Label>
              <Input
                id="initialDeposit"
                type="number"
                step="0.01"
                value={formData.initialDeposit}
                onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                placeholder="0.00"
                className="bg-input text-foreground border-border"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-border text-foreground hover:bg-muted"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
