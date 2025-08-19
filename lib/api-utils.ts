import { NextResponse } from 'next/server';

type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export function successResponse<T = any>(data: T, message: string = 'Success'): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

export function errorResponse(
  status: number = 500,
  message: string = 'Internal Server Error',
  error?: any
): NextResponse<ApiResponse> {
  console.error('API Error:', error);
  return NextResponse.json(
    {
      success: false,
      error: error?.message || message,
      message,
    },
    { status }
  );
}

export function notFoundResponse(message: string = 'Resource not found'): NextResponse<ApiResponse> {
  return errorResponse(404, message);
}

export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return errorResponse(401, message);
}

export function badRequestResponse(message: string = 'Bad Request'): NextResponse<ApiResponse> {
  return errorResponse(400, message);
}
