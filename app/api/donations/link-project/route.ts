import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, NotFoundError } from '@/lib/domain/errors/CustomError';

/**
 * POST /api/donations/link-project
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donationId, projectId } = body;

    // Verificar que la donación exista
    const donation = await repositories.donationRepository.findById(donationId);
    if (!donation) {
      throw new NotFoundError('Donation not found');
    }

    // Verificar que el proyecto exista
    const project = await repositories.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Crear la relación
    const donationProject = await repositories.donationProjectRepository.create({
      donationId,
      projectId,
    } as any);

    return NextResponse.json({
      success: true,
      data: donationProject.toJSON(),
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

