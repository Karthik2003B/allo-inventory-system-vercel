import { prisma } from "@/src/lib/prisma";
import CountdownTimer from "@/src/components/CountdownTimer";
async function getReservation(id: string) {

  return prisma.reservation.findUnique({
    where: {
      id,
    },

    
    include: {
      product: true,
      warehouse: true,
    },
  });
}

export default async function ReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const reservation =
    await getReservation(id);

  if (!reservation) {

    return (
      <div className="p-10">
        Reservation not found
      </div>
    );
  }

  return (
    <main className="min-h-screen p-10">

      <h1 className="text-4xl font-bold mb-8">
        Reservation Details
      </h1>

      <div className="border rounded-2xl p-6 max-w-xl">

        <h2 className="text-2xl font-semibold mb-4">
          {reservation.product.name}
        </h2>

        <p className="mb-2">
          Warehouse:
          {" "}
          {reservation.warehouse.name}
        </p>

        <p className="mb-2">
          Quantity:
          {" "}
          {reservation.quantity}
        </p>

        <p className="mb-2">
          Status:
          {" "}
          <span
            className={`font-bold ${
              reservation.status === "PENDING"
                ? "text-yellow-500"
                : reservation.status ===
                  "CONFIRMED"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {reservation.status}
          </span>
        </p>

        <div className="mb-4">

          <p className="font-medium mb-2">
            Time Remaining
          </p>

          <CountdownTimer
            expiresAt={reservation.expiresAt.toISOString()}
          />

        </div>

        <div className="flex gap-4 mt-6">

          <form
            action={`/api/reservations/${reservation.id}/confirm`}
            method="POST"
          >

            <button
              disabled={
                reservation.status !==
                "PENDING"
              }
              className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Confirm Purchase
            </button>

          </form>

          <form
            action={`/api/reservations/${reservation.id}/release`}
            method="POST"
          >

            <button
              disabled={
                reservation.status !==
                "PENDING"
              }
              className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Cancel Reservation
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}