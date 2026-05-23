async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function HomePage() {

  const products = await getProducts();

  return (
    <main className="min-h-screen p-10">

      <h1 className="text-4xl font-bold mb-8">
        Inventory System
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {products.map((product: any) => (

          <div
            key={product.id}
            className="border rounded-2xl p-6 shadow-sm"
          >

            <h2 className="text-2xl font-semibold mb-4">
              {product.name}
            </h2>

            <div className="space-y-4">

              {product.inventories.map((inventory: any) => (

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
                        {inventory.availableQuantity}
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