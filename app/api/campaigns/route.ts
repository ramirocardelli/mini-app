import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, ValidationError } from '@/lib/domain/errors/CustomError';
import { CampaignStatus } from '@/lib/domain/entities/Campaign';

/**
 * GET /api/campaigns
 */
export async function GET(request: NextRequest) {
  try {
    const campaigns = await repositories.campaignRepository.findAll();

    return NextResponse.json({
      success: true,
      data: campaigns.map((campaign) => campaign.toJSON()),
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
 * POST /api/campaigns
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, goalAmount, goalToken, createdBy, imageUrl, startDate, endDate } = body;

    // Validaciones
    if (!title || title.trim().length === 0) {
      throw new ValidationError('Campaign title is required');
    }
    if (!description || description.trim().length === 0) {
      throw new ValidationError('Campaign description is required');
    }
    if (goalAmount <= 0) {
      throw new ValidationError('Goal amount must be positive');
    }
    if (!createdBy || createdBy.trim().length === 0) {
      throw new ValidationError('Creator user ID is required');
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new ValidationError('Start date must be before end date');
    }

    // Verificar que el usuario creador exista
    const user = await repositories.userRepository.findById(createdBy);
    if (!user) {
      throw new ValidationError('Creator user not found');
    }

    // Crear campaña
    const campaign = await repositories.campaignRepository.create({
      title,
      description,
      goalAmount,
      goalToken: goalToken || 'USDC',
      currentAmount: 0,
      status: CampaignStatus.DRAFT,
      imageUrl: imageUrl || null,
      startDate: startDate || null,
      endDate: endDate || null,
      createdBy,
    } as any);

    return NextResponse.json(
      {
        success: true,
        data: campaign.toJSON(),
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

