import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, ConflictError, ValidationError } from '@/lib/domain/errors/CustomError';

/**
 * GET /api/beneficiaries
 */
export async function GET(request: NextRequest) {
  try {
    const beneficiaries = await repositories.beneficiaryRepository.findAll();

    return NextResponse.json({
      success: true,
      data: beneficiaries.map((beneficiary) => beneficiary.toJSON()),
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
 * POST /api/beneficiaries
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, wallet } = body;

    // Validaciones
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Beneficiary name is required');
    }
    if (!wallet || wallet.trim().length === 0) {
      throw new ValidationError('Wallet address is required');
    }

    // Verificar si ya existe un beneficiario con esa wallet
    const existing = await repositories.beneficiaryRepository.findByWallet(wallet);
    if (existing) {
      throw new ConflictError('Beneficiary with this wallet already exists');
    }

    // Crear beneficiario
    const beneficiary = await repositories.beneficiaryRepository.create({
      name,
      wallet,
    } as any);

    return NextResponse.json(
      {
        success: true,
        data: beneficiary.toJSON(),
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

