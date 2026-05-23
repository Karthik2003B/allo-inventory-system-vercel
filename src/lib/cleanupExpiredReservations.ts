import { prisma } from "./prisma";

export async function cleanupExpiredReservations() {

  // Find expired pending reservations
  const expiredReservations =
    await prisma.reservation.findMany({
      where: {
        status: "PENDING",

        expiresAt: {
          lt: new Date(),
        },
      },
    });

  for (const reservation of expiredReservations) {

    // Find inventory
    const inventory =
      await prisma.inventory.findFirst({
        where: {
          productId:
            reservation.productId,

          warehouseId:
            reservation.warehouseId,
        },
      });

    if (!inventory) continue;

    // Release reserved stock
    await prisma.inventory.update({
      where: {
        id: inventory.id,
      },

      data: {
        reservedQuantity: {
          decrement:
            reservation.quantity,
        },
      },
    });

    // Mark reservation released
    await prisma.reservation.update({
      where: {
        id: reservation.id,
      },

      data: {
        status: "RELEASED",
      },
    });
  }
}