import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import {notFound}  from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Invoice', // metadata para el título de la página
}

// Exporta la página de edición; recibe 'params' como una Promesa que contiene el 'id' dinámico de la URL.
export default async function Page(props: {params: Promise<{id: string}>}){
    // coge el id de la URL
    const params = await props.params;
    const id = params.id;

    // coge los datos de la factura con ese ID y de los clientes
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);

    // si la factura no existe muestra el not Found
    if(!invoice){
        notFound()
    }
    return (
        <main>
            {/* sirve para mostrar el camino que sigue el usuario  (en este caso 'Invoices/Edit Invoices') */}
            <Breadcrumbs 
                breadcrumbs = {[
                    { label: 'Invoices', href: '/dashboard/invoices'},
                    {
                        label: 'Edit Invoices',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    }
                ]}
            />
            <Form invoice={invoice} customers={customers} />
        </main>
    )
}