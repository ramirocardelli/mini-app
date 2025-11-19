import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, NotFoundError, ValidationError } from '@/lib/domain/errors/CustomError';

/**
 * GET /api/beneficiaries/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const beneficiary = await repositories.beneficiaryRepository.findById(params.id);

    if (!beneficiary) {
      throw new NotFoundError(`Beneficiary with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      data: beneficiary.toJSON(),
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: error.code === 'NOT_FOUND' ? 404 : 400 }
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
 * PUT /api/beneficiaries/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, wallet } = body;

    if (name && name.trim().length === 0) {
      throw new ValidationError('Beneficiary name cannot be empty');
    }
    if (wallet && wallet.trim().length === 0) {
      throw new ValidationError('Wallet address cannot be empty');
    }

    const beneficiary = await repositories.beneficiaryRepository.update(params.id, {
      name,
      wallet,
    } as any);

    if (!beneficiary) {
      throw new NotFoundError(`Beneficiary with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      data: beneficiary.toJSON(),
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: error.code === 'NOT_FOUND' ? 404 : 400 }
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
 * DELETE /api/beneficiaries/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await repositories.beneficiaryRepository.delete(params.id);

    if (!deleted) {
      throw new NotFoundError(`Beneficiary with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      message: 'Beneficiary deleted successfully',
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: error.code === 'NOT_FOUND' ? 404 : 400 }
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

