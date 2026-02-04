import Link from 'next/link';
import { BookOpen, Clock, DollarSign, Users, Package } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Biblioteca
          </h1>
          <p className="text-xl text-gray-600">
            Dashboard de reportes y análisis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Libros más prestados */}
          <Link href="/reports/most-borrowed" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500">
              <div className="flex items-center mb-3">
                <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Libros más prestados
                </h2>
              </div>
              <p className="text-gray-600">
                Ranking de popularidad de libros
              </p>
            </div>
          </Link>

          {/* Card 2: Préstamos vencidos */}
          <Link href="/reports/overdue-loans" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-red-500">
              <div className="flex items-center mb-3">
                <Clock className="w-6 h-6 text-red-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Préstamos vencidos
                </h2>
              </div>
              <p className="text-gray-600">
                Libros no devueltos a tiempo
              </p>
            </div>
          </Link>

          {/* Card 3: Resumen de multas */}
          <Link href="/reports/fines-summary" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-yellow-500">
              <div className="flex items-center mb-3">
                <DollarSign className="w-6 h-6 text-yellow-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Resumen de multas
                </h2>
              </div>
              <p className="text-gray-600">
                Análisis mensual de multas
              </p>
            </div>
          </Link>

          {/* Card 4: Actividad de socios */}
          <Link href="/reports/member-activity" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
              <div className="flex items-center mb-3">
                <Users className="w-6 h-6 text-green-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Actividad de socios
                </h2>
              </div>
              <p className="text-gray-600">
                Estadísticas de usuarios
              </p>
            </div>
          </Link>

          {/* Card 5: Salud del inventario */}
          <Link href="/reports/inventory-health" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500">
              <div className="flex items-center mb-3">
                <Package className="w-6 h-6 text-purple-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Salud del inventario
                </h2>
              </div>
              <p className="text-gray-600">
                Estado por categoría
              </p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
