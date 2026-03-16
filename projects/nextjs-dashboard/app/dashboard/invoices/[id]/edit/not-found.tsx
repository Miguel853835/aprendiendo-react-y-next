import Link from 'next/link'; // importa Link, sirve para precargar la página a la que se dirige el usuario y evitar recargas completas
import { FaceFrownIcon } from '@heroicons/react/24/outline'; // importa el FaceFrown (cara triste)

export default function notFound(){
    return(
        <main className="flex h-full flex-col items-center justify-center gap-2">
            <FaceFrownIcon className="w-10 text-gray-400"/>
            <h2 className="text-xl font-semibold">404 Not Found</h2>
            <p>Could not find the requested invoice</p>
            <Link
                href="/dashboard/invoices"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 tex-sm text-white transition-color hover:bg-blue-400">
            Go Back
            </Link>
        </main>
    )
}