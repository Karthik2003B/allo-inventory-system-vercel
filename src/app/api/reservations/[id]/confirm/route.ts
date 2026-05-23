import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {

  try {

    const { id } = await context.params;

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id,
        },
      });

    if (!reservation) {

      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Already expired
    if (
      reservation.expiresAt < new Date()
    ) {

      return NextResponse.json(
        { error: "Reservation expired" },
        { status: 410 }
      );
    }

    // Update inventory
    const inventory =
      await prisma.inventory.findFirst({
        where: {
          productId: reservation.productId,
          warehouseId:
            reservation.warehouseId,
        },
      });

    if (!inventory) {

      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }

    await prisma.inventory.update({
      where: {
        id: inventory.id,
      },

      data: {
        totalQuantity: {
          decrement:
            reservation.quantity,
        },

        reservedQuantity: {
          decrement:
            reservation.quantity,
        },
      },
    });

    // Confirm reservation
    await prisma.reservation.update({
      where: {
        id,
      },

      data: {
        status: "CONFIRMED",
      },
    });

    return NextResponse.redirect(
      new URL(`/reservation/${id}`, req.url)
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Confirmation failed" },
      { status: 500 }
    );
  }
}