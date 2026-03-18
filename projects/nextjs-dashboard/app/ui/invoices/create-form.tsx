'use client';
import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useActionState, useState } from 'react';
import { createInvoice, State, } from '@/app/lib/actions';
import { CreateInvoice as CreateInvoiceSchema} from '@/app/lib/definitions'
import { useForm } from 'react-hook-form';
import {z}  from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDateToLocal } from '@/app/lib/utils';
import { Result } from 'postcss';

type FormValues = z.infer<typeof CreateInvoiceSchema>;

export default function Form({ customers }: { customers: CustomerField[] }) {
  const [serverError, setServerError] = useState<string | null>(null)
  // se inicializa el react hook form
  const { register, handleSubmit, formState:{errors, isSubmitting},} = useForm<FormValues>({
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues: {
      customerId: '',
      amount: 0,
      status: 'pending',
    }
  });
  const initialState: State = {message: null, errors:{}}
  //const [state, formAction] = useActionState(createInvoice, initialState);

  // funcion al enviar los datos
  const onSubmit = async(data:FormValues) => {
    setServerError(null);
    const formData = new FormData();
    formData.append('customerId', data.customerId);
    formData.append('amount', data.amount.toString());
    formData.append('status', data.status);

    // llamada a la accion
    const result = await createInvoice(initialState, formData)
    if(result?.message){
      setServerError(result.message);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              {...register('customerId')}
              //name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              //defaultValue=""
              // aria-describedby='customer-error'
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {/* ERROR DESDE RHF */}
          {errors.customerId && (
            <p className="mt-2 text-sm text-red-500">{errors.customerId.message}</p>
          )}
          {/* <div id="customer-error" aria-live='polite' aria-atomic="true">
              {state.errors?.customerId &&
              state.errors.customerId.map((error:string) => (
                <p className = "mt-2 text-sm text-red-500" key = {error}>
                    {error}
                </p>
              ))}
          </div> */}
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                {...register('amount')}
                //name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                //aria-describedby='amount-error'
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/* ERROR DESDE RHF */}
            {errors.amount && (
              <p className="mt-2 text-sm text-red-500">{errors.amount.message}</p>              
            )}
            {/*<div id="amount-error" aria-live='polite' aria-atomic="true">
              {state.errors?.amount &&
              state.errors.amount.map((error:string) => (
                <p className = "mt-2 text-sm text-red-500" key = {error}>
                    {error}
                </p>
              ))}
            </div> */}
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  {...register('status')}
                  //name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  //aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  {...register('status')}
                  //name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  //aria-describedby="status-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          {/* ERROR DESDE RHF */}
          {errors.status && (
            <p className="mt-2 text-sm text-red-500">{errors.status.message}</p>
          )}
          {/* <div id="status-error" aria-live='polite' aria-atomic="true">
              {state.errors?.status &&
              state.errors.status.map((error:string) => (
                <p className = "mt-2 text-sm text-red-500" key = {error}>
                    {error}
                </p>
              ))}
          </div> */}
        </fieldset>
        {serverError && (
          <p className="mt-4 text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
            {serverError}
          </p>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Invoice'}</Button>
      </div>
    </form>
  );
}
