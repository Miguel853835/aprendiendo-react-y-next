import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

// conexión a la base de datos con la url y obligando a que sea segura
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// funcion que recoge los datos de ganancias
export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    // se pone un timeout de 3 segundos para que se vea el skeletomn
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // se seleccionan los datos y se guardan en la variable
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    // se devuelven
    return data;
  } 
  // si hay un error se captura y se lanza 
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

// funcion para recuperar las ultimas facturas
export async function fetchLatestInvoices() {
  try {
    // guarda en la variable las últimas 5 facturas con sus datos
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;
    // se hace una copia de la factura original para embellecer la cantidad
    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    //se devuelve
    return latestInvoices;
  } 
  // si hay un error se captura y se lanza 
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

// funcion para mostrar los datos de las tarjetas
export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    // se coge el conteo de facturas
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    // se coge el conteo de clientes
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    // se coge la cantidad de facturas pagadas y pendientes por separado
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    // se hacen las consultas a la vez para ahorrar tiempo
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    // se recoge el numero total de cada dato
    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    // y se devuelve
    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } 
  // si hay un error se captura y se lanza 
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

// establecemos que haya 6 elementos por página en las tablas
const ITEMS_PER_PAGE = 6;

// funcion que filtra las facturas
export async function fetchFilteredInvoices(
  query: string,  // la busqueda del usuario
  currentPage: number, // la pagina
) {
  // cálculo de cuantas facturas hay que saltarse para llegar a la página actual.
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // recoge todos los datos necesarios de la factura y el cliente
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    //y los devuelve
    return invoices;
  } 
  // si hay un error se captura y se lanza
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

// funcion para calcular el número de paginas que tiene la busqueda
export async function fetchInvoicesPages(query: string) {
  try {
    // guarda el conteo de las facturas que coinciden con la busquda
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;
    // hace el calculo teniendo en cuenta que hay 6 por pagina
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    // devuelve el total de paginas
    return totalPages;
  } 
  // si hay un error se captura y se lanza
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

// funcion que busca la factura por id
export async function fetchInvoiceById(id: string) {
  try {
    // guarda los datos de la factura que coincide con el id
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;
    // hace una copia para pasar la cantidad a dolares
    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    // se devuelve la primera factura de la lista
    return invoice[0];
  } 
  // si hay un error se captura y se lanza
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

// funcion que busca clientes
export async function fetchCustomers() {
  try {
    // recoge id y nombre de los clientes en orden alfabetico
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;
    // los devuelve
    return customers;
  } 
  // si hay un error se captura y se lanza
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

// funcion que devuelve los clientes filtrados
export async function fetchFilteredCustomers(query: string) {
  try {
    // recoge los datos de los clientes que cumplen el filtro
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    // hace una copia para enbellecer la suma del total de sus facturas pagadas y pendientes
    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
    
    // devuelve los clientes
    return customers;
    
  } 
  // si hay un error se captura y se lanza
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
