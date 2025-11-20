import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, NotFoundError, ValidationError } from '@/lib/domain/errors/CustomError';
import { DonationStatus } from '@/lib/domain/entities/Donation';

/**
 * GET /api/donations
 * Query params: ?userId=xxx | ?campaignId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const campaignId = searchParams.get('campaignId');

    let donations;

    if (userId) {
      donations = await repositories.donationRepository.findByUserId(userId);
    } else if (campaignId) {
      donations = await repositories.donationRepository.findByCampaignId(campaignId);
    } else {
      donations = await repositories.donationRepository.findAll();
    }

    return NextResponse.json({
      success: true,
      data: donations.map((donation) => donation.toJSON()),
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
 * POST /api/donations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, campaignId, amount, token, paymentId } = body;

    // Validaciones
    if (!userId || userId.trim().length === 0) {
      throw new ValidationError('User ID is required');
    }
    if (!campaignId || campaignId.trim().length === 0) {
      throw new ValidationError('Campaign ID is required');
    }
    if (!amount || amount <= 0) {
      throw new ValidationError('Amount must be greater than 0');
    }
    if (!token || token.trim().length === 0) {
      throw new ValidationError('Token is required');
    }
    if (!paymentId || paymentId.trim().length === 0) {
      throw new ValidationError('Payment ID is required');
    }

    // Verificar que el usuario exista
    const user = await repositories.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verificar que la campaña exista
    const campaign = await repositories.campaignRepository.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    // Crear donación
    const donation = await repositories.donationRepository.create({
      userId,
      campaignId,
      amount,
      token,
      paymentId,
      status: DonationStatus.PENDING,
      txHash: null,
    } as any);

    // Actualizar el currentAmount de la campaña
    try {
      const updatedCurrentAmount = campaign.currentAmount + amount;
      await repositories.campaignRepository.update(campaignId, {
        currentAmount: updatedCurrentAmount,
      } as any);
    } catch (updateError) {
      console.error('Error updating campaign amount:', updateError);
      // No lanzamos error para no bloquear la creación de la donación
    }

    return NextResponse.json(
      {
        success: true,
        data: donation.toJSON(),
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

