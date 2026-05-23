import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

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

    // Update reservation
    await prisma.reservation.update({
      where: {
        id,
      },

      data: {
        status: "RELEASED",
      },
    });

    return NextResponse.redirect(
      new URL("/", request.url)
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Release failed" },
      { status: 500 }
    );
  }
}