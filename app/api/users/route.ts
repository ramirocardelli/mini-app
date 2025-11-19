import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, ConflictError, ValidationError } from '@/lib/domain/errors/CustomError';

/**
 * GET /api/users
 * Query params: ?wallet=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (wallet) {
      const user = await repositories.userRepository.findByWallet(wallet);
      
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: `User with wallet ${wallet} not found`,
            code: 'NOT_FOUND',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user.toJSON(),
      });
    }

    const users = await repositories.userRepository.findAll();

    return NextResponse.json({
      success: true,
      data: users.map((user) => user.toJSON()),
    });
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

/**
 * POST /api/users
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, username } = body;

    // Validaciones
    if (!wallet || wallet.trim().length === 0) {
      throw new ValidationError('Wallet address is required');
    }
    if (!username || username.trim().length < 3) {
      throw new ValidationError('Username must be at least 3 characters long');
    }

    // Verificar si el usuario ya existe
    const existingUser = await repositories.userRepository.findByWallet(wallet);
    if (existingUser) {
      throw new ConflictError('User with this wallet already exists');
    }

    // Crear usuario
    const user = await repositories.userRepository.create({
      wallet,
      username,
    } as any);

    return NextResponse.json(
      {
        success: true,
        data: user.toJSON(),
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
        { status: error.code === 'CONFLICT' ? 409 : 400 }
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

