import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, ValidationError } from '@/lib/domain/errors/CustomError';

/**
 * POST /api/users/by-wallet
 * Get or create user by wallet address
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    // Validaciones
    if (!walletAddress || walletAddress.trim().length === 0) {
      throw new ValidationError('Wallet address is required');
    }

    // Buscar usuario existente
    const existingUser = await repositories.userRepository.findByWallet(walletAddress);
    
    if (existingUser) {
      return NextResponse.json({
        success: true,
        data: existingUser.toJSON(),
      });
    }

    // Crear nuevo usuario si no existe
    const username = `user_${walletAddress.slice(0, 8)}`;
    const newUser = await repositories.userRepository.create({
      walletAddress,
      username,
    } as any);

    return NextResponse.json(
      {
        success: true,
        data: newUser.toJSON(),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

