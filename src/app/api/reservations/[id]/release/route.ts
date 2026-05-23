import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  req: NextRequest,
  context: any
) {

  try {

    const reservationId =
      context.params.id;

    // Find reservation
    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: reservationId,
        },
      });

    if (!reservation) {

      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Already released
    if (
      reservation.status === "RELEASED"
    ) {

      return NextResponse.json(
        { error: "Already released" },
        { status: 400 }
      );
    }

    // Restore inventory
    const inventory =
      await prisma.inventory.findFirst({
        where: {
          productId:
            reservation.productId,

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

    // Reduce reserved quantity
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

    // Update reservation status
    await prisma.reservation.update({
      where: {
        id: reservation.id,
      },

      data: {
        status: "RELEASED",
      },
    });

    return NextResponse.redirect(
      new URL("/", req.url)
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Release failed" },
      { status: 500 }
    );
  }
}