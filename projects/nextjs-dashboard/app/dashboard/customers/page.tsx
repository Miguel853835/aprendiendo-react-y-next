// importa el componente metadata
import { Metadata } from 'next';

// metadata para el título de la página
export const metadata: Metadata = {
    title: 'Customers',
}
// exporta el componente de la página de clientes
export default function Page (){
    return(
        <p>Customers page</p>
    )
}