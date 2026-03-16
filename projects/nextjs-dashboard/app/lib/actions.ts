'use server';
import { z } from 'zod'
import postgres from 'postgres'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// conexión a la base de datos con la url y obligando a que sea segura
const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

// el Schema define la estructura válida del formulario (el id y la fecha se hacen automáticamente por lo que no salta un error)
const FormSchema = z.object({
    id: z.string(),
    customerId : z.string({
        invalid_type_error: 'Please select a customer', // da un error si no seleccionas un cliente
    }),
    amount: z.coerce.number().gt(0, 'Please enter an amount greater than $0'), // da un error si pones una cantidad menor o igual que 0
    status: z.enum(['pending', 'paid'],{
        invalid_type_error: 'Please select an invoice status', // da un error si no seleccionas ninguno de los dos estados
    }),
    date: z.string()
})

// Schema para actualizar y crear (en ambos se omite id y fecha porque no lo gestiona el usuario)
const UpdateInvoice = FormSchema.omit({ id: true, date: true});
const CreateInvoice = FormSchema.omit({id: true, date:true});

// define como es la respuesta que recibe el usuario
export type State = {
    errors?: { //errores específicos (se usan arrays porque un campo podría tener varios errores)
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null; // errores generales como "faltan campos por rellenar"
};


// funcion para crear facturas
export async function createInvoice(prevState: State, formData: FormData){
        // comprueba que los datos recibidos son válidos
        const validatedFields = CreateInvoice.safeParse({
        customerId : formData.get('customerId'),
        amount : formData.get('amount'),
        status : formData.get('status'),
    });

    // si no lo son salta el error
    if(!validatedFields.success){
        return{
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice',
        }
    }

    // rellena las variables con los datos validados
    const { customerId, amount, status} = validatedFields.data;
    // la cantidad la pasamos a céntimos
    const amountInCents = amount*100;
    // cogemos solo el día/mes/año de la fecha (1. Se pasa a STring 2. Se 'parte' en dos con el caracter 'T' 3. Se coge la primera posición de la cadena)
    const date = new Date().toISOString().split('T')[0];
    try{
    // se inserta en base de datos la nueva factura
    await sql `INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
    }
    // si salta error se captura
    catch(error){
        return{
            message: 'Database Error: Failed to Create Invoice'
        }
    }

    // una vez isnertado se avisa de que han cambiado las facturas
    revalidatePath('/dashboard/invoices');
    // y se redirige allí al usuario
    redirect('/dashboard/invoices');    
}

// funcion que actualiza una factura de la base de datos
export async function updateInvoice(id: string, prev:State, formData: FormData){
    // primero se valida que los datos estén correctos
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })
    // si algo no está bien devuelve error
    if(!validatedFields.success){
        return{
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice',
        }
    }

    // rellena las variables con los nuevos datos
    const { customerId, amount, status } = validatedFields.data;
    // la cantidad pasa a centimos
    const amountInCents = amount * 100;
    try{
        // se actualiza la factura en la base de datos
        await sql `UPDATE invoices SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} WHERE id = ${id}`;
    }
    catch(error){
        // si da algún error se captura y devuelve el mensaje
        console.error(error);
        return{
            message: 'Database Error: Failed to update Invoice'
        }
    }
    // una vez insertado se avisa de que han cambiado las facturas
    revalidatePath('/dashboard/invoices');
    // y se redirige al usuario
    redirect('/dashboard/invoices');
     
}

// funcion que elimina una factura
export async function deleteInvoice(id: string){
    //throw new Error('Failed to Delete Invoice');
    // se elimina en la base de datos segun el id
    await sql `DELETE FROM invoices WHERE id = ${id}`;
    // se avisa de que las facturas han cambiado
    revalidatePath('/dashboard/invoices');
    
}

// funcion para autenticarse
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
){

    try{
        // llamada a la función signIn (busca en el proveedor Credentials y pasa los datos del login) 
        await signIn('credentials', formData);
    }catch(error){
        // si hay un error se captura y dependiendo del caso devuelve uno u otro
        if(error instanceof AuthError){
            switch (error.type){
                case 'CredentialsSignin':
                    return 'Invalid credentials';
                default:
                    return 'Something went wrong';
            }
        }
        throw error;
    }
}