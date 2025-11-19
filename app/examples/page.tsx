'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usersApi, campaignsApi } from '@/lib/services/api';

/**
 * Página de Ejemplos - Demostración de API Routes
 * 
 * Este componente muestra cómo usar las API Routes
 * para interactuar con la base de datos
 */
export default function ExamplesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Ejemplo 1: Crear un Usuario
  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const result = await usersApi.create({
        wallet: `0x${Math.random().toString(16).substr(2, 40)}`,
        username: `user_${Date.now()}`,
      });
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: 'Error creating user' });
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 2: Obtener Todos los Usuarios
  const handleGetAllUsers = async () => {
    setLoading(true);
    try {
      const result = await usersApi.getAll();
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: 'Error fetching users' });
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 3: Crear una Campaña
  const handleCreateCampaign = async () => {
    setLoading(true);
    try {
      const result = await campaignsApi.create({
        title: `Campaign ${Date.now()}`,
        description: 'This is a test campaign created from the examples page',
        goalAmount: 1000,
        goalCurrency: 'USD',
        imageUrl: 'https://via.placeholder.com/400',
      });
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: 'Error creating campaign' });
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 4: Obtener Todas las Campañas
  const handleGetAllCampaigns = async () => {
    setLoading(true);
    try {
      const result = await campaignsApi.getAll();
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: 'Error fetching campaigns' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">API Routes + Neon - Ejemplos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 1: User Actions */}
        <Card>
          <CardHeader>
            <CardTitle>User Actions</CardTitle>
          <CardDescription>
            Crear y obtener usuarios usando API Routes con Neon PostgreSQL
          </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={handleCreateUser}
              disabled={loading}
              className="w-full"
            >
              Crear Usuario Aleatorio
            </Button>
            <Button
              onClick={handleGetAllUsers}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Obtener Todos los Usuarios
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: Campaign Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Actions</CardTitle>
          <CardDescription>
            Crear y obtener campañas usando API Routes con Neon PostgreSQL
          </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={handleCreateCampaign}
              disabled={loading}
              className="w-full"
            >
              Crear Campaña de Prueba
            </Button>
            <Button
              onClick={handleGetAllCampaigns}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Obtener Todas las Campañas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resultado */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          <CardDescription>
            Respuesta de la API (datos almacenados en Neon)
          </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Información */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>ℹ️ Información</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              Las API Routes se ejecutan en el servidor y tienen acceso directo
              a Neon PostgreSQL
            </li>
            <li>
              Arquitectura completamente desacoplada: Frontend → API Routes → Repositories
            </li>
            <li>
              Los datos se validan automáticamente en el servidor
            </li>
            <li>
              La arquitectura sigue Clean Architecture con Sequelize y Neon
            </li>
            <li>
              Para ver más detalles, revisa{' '}
              <code className="bg-gray-200 px-1 rounded">
                app/api/README.md
              </code>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

