import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Invoices',
}

export default async function Page(props: {
    // recibe como prop el searchParams que tiene la búsqueda (query) y la pagina (page) 
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {

    // searchParams coge los filtros de la URL
    const searchParams = await props.searchParams;
    // coge la búsqueda (si no hay la pone vacía)
    const query = searchParams?.query || '';
    // coge la página actual (por defecto en 1)
    const currentPage = Number(searchParams?.page) || 1;
    // coge el total de páginas llamando a la funcion que cuenta los resultados y saca el total de página en las que se distribuyen
    const totalPages = await fetchInvoicesPages(query);
    
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search invoices..." />
                <CreateInvoice />
            </div>
            {/* cada vez que el usuario hace una búsqueda se muestra el skeleton mientras carga */}
              <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} /> 
            </div>
        </div>
    );
}