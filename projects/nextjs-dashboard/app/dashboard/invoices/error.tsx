'use client'; // los error.tsx siempre son Client Component

import { useEffect } from 'react';

export default function Error({
    error, // contiene la información del error
    reset, // esta función intenta recargar la página sin recargar el navegador
}: {
    error: Error & { digest?: string}; // el digest es un hash para buscar el error en los logs
    reset: () => void, // función que intenta recargar la página por si el error ya ha pasado
}) {
    useEffect(() => {
        console.log(error) // si cambia la dependencia muestra el error en consola
    }, [error]);

    return (
        <main className = "flex h-full flex-col items-center justify-center">
            <h2 className="text-center">Something went wrong!</h2>
            <button 
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                onClick={
                    ()=> reset()  // al pulsar el boton se lanza el reset
                }
            >
                Try again
            </button>
        </main>
    )
}