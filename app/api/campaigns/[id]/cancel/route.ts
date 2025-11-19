import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, NotFoundError } from '@/lib/domain/errors/CustomError';

/**
 * POST /api/campaigns/[id]/cancel
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await repositories.campaignRepository.findById(params.id);

    if (!campaign) {
      throw new NotFoundError(`Campaign with ID ${params.id} not found`);
    }

    campaign.cancel();

    const updated = await repositories.campaignRepository.update(params.id, { status: campaign.status } as any);

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

