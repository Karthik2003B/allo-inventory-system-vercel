import { prisma } from "../lib/prisma";

export default async function HomePage() {

  const products =
    await prisma.product.findMany({
      include: {
        inventories: {
          include: {
            warehouse: true,
          },
        },
      },
    });

  const formattedProducts =
    products.map((product: any) => ({
      id: product.id,
      name: product.name,

      inventories:
        product.inventories.map(
          (inventory: any) => ({
            warehouseId:
              inventory.warehouse.id,

            warehouseName:
              inventory.warehouse.name,

            availableQuantity:
              inventory.totalQuantity -
              inventory.reservedQuantity,
          })
        ),
    }));

  return (
    <main className="min-h-screen p-10">

      <h1 className="text-4xl font-bold mb-8">
        Inventory System
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {formattedProducts.map(
          (product: any) => (

          <div
            key={product.id}
            className="border rounded-2xl p-6 shadow-sm"
          >

            <h2 className="text-2xl font-semibold mb-4">
              {product.name}
            </h2>

            <div className="space-y-4">

              {product.inventories.map(
                (inventory: any) => (

                <form
                  key={inventory.warehouseId}
                  action="/api/reservations"
                  method="POST"
                  className="border rounded-lg p-4 flex justify-between items-center"
                >

                  <div>

                    <p className="font-medium">
                      {inventory.warehouseName}
                    </p>

                    <p>
                      Available Stock:{" "}
                      <span className="font-bold">
                        {
                          inventory.availableQuantity
                        }
                      </span>
                    </p>

                  </div>

                  <div>

                    <input
                      type="hidden"
                      name="productId"
                      value={product.id}
                    />

                    <input
                      type="hidden"
                      name="warehouseId"
                      value={inventory.warehouseId}
                    />

                    <input
                      type="hidden"
                      name="quantity"
                      value="1"
                    />

                    <button
                      className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                      Reserve
                    </button>

                  </div>

                </form>
              ))}

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}