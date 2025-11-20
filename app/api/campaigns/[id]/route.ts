import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, NotFoundError } from '@/lib/domain/errors/CustomError';

/**
 * GET /api/campaigns/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await repositories.campaignRepository.findById(params.id);

    if (!campaign) {
      throw new NotFoundError(`Campaign with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      data: campaign.toJSON(),
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
 * PUT /api/campaigns/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, goalAmount, goalCurrency, imageUrl, startDate, endDate, status } = body;

    const campaign = await repositories.campaignRepository.update(params.id, {
      title,
      description,
      goalAmount,
      goalCurrency,
      imageUrl,
      startDate,
      endDate,
      status,
    } as any);

    if (!campaign) {
      throw new NotFoundError(`Campaign with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      data: campaign.toJSON(),
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
 * DELETE /api/campaigns/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await repositories.campaignRepository.delete(params.id);

    if (!deleted) {
      throw new NotFoundError(`Campaign with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully',
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

