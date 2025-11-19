import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, NotFoundError } from '@/lib/domain/errors/CustomError';

/**
 * POST /api/projects/[id]/approve
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await repositories.projectRepository.findById(params.id);

    if (!project) {
      throw new NotFoundError(`Project with ID ${params.id} not found`);
    }

    // Usar lógica de negocio de la entidad
    project.approve();

    const updated = await repositories.projectRepository.update(params.id, { status: project.status } as any);

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

