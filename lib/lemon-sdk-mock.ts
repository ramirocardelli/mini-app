export interface LemonUser {
  id: string;
  email: string;
  walletAddress: string;
}

export interface LemonAuthResponse {
  success: boolean;
  user?: LemonUser;
  error?: string;
}

export interface LemonPaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

class LemonSDK {
  private authenticated = false;
  private currentUser: LemonUser | null = null;

  // Mock authentication
  async authenticate(): Promise<LemonAuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful authentication
        this.authenticated = true;
        this.currentUser = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email: 'demo@lemoncash.com',
          walletAddress: '0x' + Math.random().toString(16).substr(2, 40),
        };
        resolve({
          success: true,
          user: this.currentUser,
        });
      }, 1000);
    });
  }

  // Mock payment/deposit
  async makePayment(amount: number, recipientAddress: string): Promise<LemonPaymentResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.authenticated) {
          resolve({
            success: false,
            error: 'User not authenticated',
          });
          return;
        }

        if (amount <= 0) {
          resolve({
            success: false,
            error: 'Invalid amount',
          });
          return;
        }

        // Simulate successful payment
        resolve({
          success: true,
          transactionId: 'tx_' + Math.random().toString(36).substr(2, 16),
        });
      }, 1500);
    });
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getCurrentUser(): LemonUser | null {
    return this.currentUser;
  }

  logout() {
    this.authenticated = false;
    this.currentUser = null;
  }
}

export const lemonSDK = new LemonSDK();
