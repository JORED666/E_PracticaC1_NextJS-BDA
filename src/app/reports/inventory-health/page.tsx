import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { query } from '@/lib/db';
import { InventoryHealth } from '@/types';

export default async function InventoryHealthPage() {
  let inventory: InventoryHealth[] = [];
  let error = null;

  try {
    const result = await query('SELECT * FROM vw_inventory_health');
    inventory = result.rows;
  } catch (err) {
    error = 'Error al cargar los datos';
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Salud del inventario
          </h1>
          <p className="text-gray-600 mt-2">
            Estado de disponibilidad por categoría
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {inventory.map((item, idx) => (
            <div key={idx} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.category}
                </h3>
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  item.health_status === 'Saludable' ? 'bg-green-100 text-green-800' :
                  item.health_status === 'Aceptable' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.health_status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {item.unique_books}
                  </div>
                  <div className="text-sm text-gray-500">Libros únicos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {item.total_copies}
                  </div>
                  <div className="text-sm text-gray-500">Copias totales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {item.available_copies}
                  </div>
                  <div className="text-sm text-gray-500">Disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {item.loaned_copies}
                  </div>
                  <div className="text-sm text-gray-500">Prestados</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {item.damaged_copies}
                  </div>
                  <div className="text-sm text-gray-500">Dañados</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    {item.lost_copies}
                  </div>
                  <div className="text-sm text-gray-500">Perdidos</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Disponibilidad
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {Number(item.availability_percentage).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      Number(item.availability_percentage) >= 70 ? 'bg-green-500' :
                      Number(item.availability_percentage) >= 40 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${item.availability_percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {inventory.length === 0 && !error && (
          <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">
            No hay datos de inventario
          </div>
        )}
      </div>
    </div>
  );
}
