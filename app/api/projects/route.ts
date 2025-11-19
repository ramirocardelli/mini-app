import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, NotFoundError, ValidationError } from '@/lib/domain/errors/CustomError';
import { ProjectStatus } from '@/lib/domain/entities/Project';

/**
 * GET /api/projects
 * Query params: ?creatorId=xxx | ?status=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const status = searchParams.get('status');

    let projects;

    if (creatorId) {
      projects = await repositories.projectRepository.findByCreatorId(creatorId);
    } else if (status) {
      projects = await repositories.projectRepository.findByStatus(status as ProjectStatus);
    } else {
      projects = await repositories.projectRepository.findAll();
    }

    return NextResponse.json({
      success: true,
      data: projects.map((project) => project.toJSON()),
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
 * POST /api/projects
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, goalAmount, goalCurrency, vaultAddress, creatorId, deadline } = body;

    // Validaciones
    if (!title || title.trim().length === 0) {
      throw new ValidationError('Project title is required');
    }
    if (!description || description.trim().length === 0) {
      throw new ValidationError('Project description is required');
    }
    if (goalAmount <= 0) {
      throw new ValidationError('Goal amount must be positive');
    }
    if (!vaultAddress || vaultAddress.trim().length === 0) {
      throw new ValidationError('Vault address is required');
    }

    // Verificar que el creador exista
    const creator = await repositories.userRepository.findById(creatorId);
    if (!creator) {
      throw new NotFoundError('Creator user not found');
    }

    // Crear proyecto
    const project = await repositories.projectRepository.create({
      title,
      description,
      goalAmount,
      goalCurrency: goalCurrency || 'USD',
      vaultAddress,
      creatorId,
      status: ProjectStatus.PENDING_REVIEW,
      deadline: deadline || null,
    } as any);

    return NextResponse.json(
      {
        success: true,
        data: project.toJSON(),
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

