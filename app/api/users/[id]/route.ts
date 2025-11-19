import { NextRequest, NextResponse } from 'next/server';
import repositories from '@/lib/infrastructure/repositories/PostgreSQL';
import { CustomError, NotFoundError, ValidationError } from '@/lib/domain/errors/CustomError';

/**
 * GET /api/users/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await repositories.userRepository.findById(params.id);

    if (!user) {
      throw new NotFoundError(`User with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      data: user.toJSON(),
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
 * PUT /api/users/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { username } = body;

    if (username && username.trim().length < 3) {
      throw new ValidationError('Username must be at least 3 characters long');
    }

    const user = await repositories.userRepository.update(params.id, { username } as any);

    if (!user) {
      throw new NotFoundError(`User with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      data: user.toJSON(),
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
 * DELETE /api/users/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await repositories.userRepository.delete(params.id);

    if (!deleted) {
      throw new NotFoundError(`User with ID ${params.id} not found`);
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
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

