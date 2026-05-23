import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { cleanupExpiredReservations }
from "@/src/lib/cleanupExpiredReservations";
export async function GET() {
  try {

    const products = await prisma.product.findMany({
      include: {
        inventories: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,

      inventories: product.inventories.map((inventory) => ({
        warehouseId: inventory.warehouse.id,
        warehouseName: inventory.warehouse.name,

        totalQuantity: inventory.totalQuantity,
        reservedQuantity: inventory.reservedQuantity,

        availableQuantity:
          inventory.totalQuantity - inventory.reservedQuantity,
      })),
    }));

    return NextResponse.json(formattedProducts);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}