import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, NotFoundError } from '@/lib/domain/errors/CustomError';
import { ProjectStatus } from '@/lib/domain/entities/Project';

/**
 * GET /api/projects/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await repositories.projectRepository.findById(params.id);

    if (!project) {
      throw new NotFoundError(`Project with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      data: project.toJSON(),
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
 * PUT /api/projects/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, goalAmount, goalCurrency, status, deadline } = body;

    const project = await repositories.projectRepository.update(params.id, {
      title,
      description,
      goalAmount,
      goalCurrency,
      status,
      deadline,
    } as any);

    if (!project) {
      throw new NotFoundError(`Project with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      data: project.toJSON(),
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
 * DELETE /api/projects/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await repositories.projectRepository.delete(params.id);

    if (!deleted) {
      throw new NotFoundError(`Project with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
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

