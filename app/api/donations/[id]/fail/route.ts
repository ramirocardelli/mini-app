import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, NotFoundError } from '@/lib/domain/errors/CustomError';

/**
 * POST /api/donations/[id]/fail
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const donation = await repositories.donationRepository.findById(params.id);

    if (!donation) {
      throw new NotFoundError(`Donation with ID ${params.id} not found`);
    }

    donation.markAsFailed();

    const updated = await repositories.donationRepository.update(params.id, {
      status: donation.status,
    } as any);

    return NextResponse.json({
      success: true,
      data: updated?.toJSON(),
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
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

