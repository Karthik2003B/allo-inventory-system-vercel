import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {

  try {

    const formData = await req.formData();

    const productId =
      formData.get("productId") as string;

    const warehouseId =
      formData.get("warehouseId") as string;

    const quantity = Number(
      formData.get("quantity")
    );

    const reservation =
      await prisma.$transaction(
        async (tx: any) => {

          // Get latest inventory
          const inventory =
            await tx.inventory.findFirst({
              where: {
                productId,
                warehouseId,
              },
            });

          if (!inventory) {
            throw new Error(
              "Inventory not found"
            );
          }

          const availableQuantity =
            inventory.totalQuantity -
            inventory.reservedQuantity;

          // Prevent overselling
          if (
            availableQuantity < quantity
          ) {
            throw new Error(
              "Not enough stock available"
            );
          }

          // Reserve stock
          await tx.inventory.update({
            where: {
              id: inventory.id,
            },

            data: {
              reservedQuantity: {
                increment: quantity,
              },
            },
          });

          // Create reservation
          return tx.reservation.create({
            data: {
              productId,
              warehouseId,
              quantity,

              status: "PENDING",

              expiresAt: new Date(
                Date.now() +
                  10 * 60 * 1000
              ),
            },
          });
        }
      );

    return NextResponse.redirect(
      new URL(
        `/reservation/${reservation.id}`,
        req.url
      )
    );

  } catch (error: any) {

    console.error(error);

    if (
      error.message ===
      "Not enough stock available"
    ) {

      return NextResponse.json(
        {
          error:
            "Not enough stock available",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Reservation failed" },
      { status: 500 }
    );
  }
}