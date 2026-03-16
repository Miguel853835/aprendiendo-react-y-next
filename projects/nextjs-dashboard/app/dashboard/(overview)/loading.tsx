// importa el componente de esqueleto para mostrar mientras se carga la página del dashboard
import DashboardSkeleton from '@/app/ui/skeletons';
 
export default function Loading() {
  // muestra el esqueleto mientras se carga la página del dashboard
  return <DashboardSkeleton />;
}