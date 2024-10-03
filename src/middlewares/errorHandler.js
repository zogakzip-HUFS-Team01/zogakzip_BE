import { Prisma } from '@prisma/client';

export default function errorHandler(error, req, res, next) {
  if (error instanceof Prisma.PrismaClientValidationError) {
    const status = 400;
    console.error(error);
    return res.status(status).json({
      message: '잘못된 요청입니다'
    });
  }

  const status = error.status ?? 500;
  console.error(error);
  return res.status(status).json({
    message: error.message ?? 'Internal Server Error'
  });
}
