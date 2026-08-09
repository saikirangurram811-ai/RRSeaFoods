import { Navigate } from "react-router-dom";

interface Props {
  children: any;
  allowedRoles: string[];
  
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const role = user.role ?? user.roles?.[0] ?? "USER";

   

  // Not logged in
  if (!user.id) return <Navigate to="/login" />;

  // Wrong role
   if (!allowedRoles.some(r => role.includes(r))) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}