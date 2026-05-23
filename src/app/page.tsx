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

  return (
    <main className="min-h-screen p-10">

      <h1 className="text-5xl font-bold mb-8">
        Inventory System
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {products.map((product: any) => (

          <div
            key={product.id}
            className="border rounded-2xl p-6"
          >

            <h2 className="text-3xl font-semibold mb-6">
              {product.name}
            </h2>

            <div className="space-y-4">

              {product.inventories.map(
                (inventory: any) => {

                const availableStock =
                  inventory.totalQuantity -
                  inventory.reservedQuantity;

                return (

                  <form
                    key={inventory.id}
                    action="/api/reservations"
                    method="POST"
                    className="border rounded-xl p-4 flex justify-between items-center"
                  >

                    <div>

                      <p className="text-lg font-medium">
                        {
                          inventory.warehouse.name
                        }
                      </p>

                      <p>
                        Available Stock:{" "}
                        {availableStock}
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
                        value={
                          inventory.warehouse.id
                        }
                      />

                      <input
                        type="hidden"
                        name="quantity"
                        value="1"
                      />

                      <button
                        className="bg-black text-white px-5 py-2 rounded-lg"
                      >
                        Reserve
                      </button>

                    </div>

                  </form>
                );
              })}

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}