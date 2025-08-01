updated-code
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";

export default function SuperAdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
        router.push("/auth/login");
        return;
      }
      setUser(currentUser);
    };
    loadUser();
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Super Admin Dashboard</h1>
      <p>Welcome, {user.name}</p>
      {/* Add more dashboard content here */}
      <button onClick={() => router.push('/superadmin/invite')}>Invite New User</button>
    </div>
  );
}

// Additional code for inviting new users
import { FormEvent, useState } from 'react';
import { UserService } from "@/services/user.service";

export default function InviteUser() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Merchant');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await UserService.inviteUser(email, role);
      setMessage(`User invited successfully! Token: ${newUser.token}`);
      // Redirect based on role
      switch (newUser.role) {
        case 'Merchant':
          router.push('/merchant/dashboard');
          break;
        case 'Developer':
          router.push('/developer/dashboard');
          break;
        case 'RefundManager':
          router.push('/refundmanager/dashboard');
          break;
        case 'Staff':
          router.push('/staff/dashboard');
          break;
        case 'SubAdmin':
          router.push('/subadmin/dashboard');
          break;
        case 'Support':
          router.push('/support/dashboard');
          break;
        default:
          router.push('/auth/login');
      }
    } catch (error) {
      setMessage('Failed to invite user.');
    }
  };

  return (
    <div>
      <h1>Invite New User</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Merchant">Merchant</option>
          <option value="Developer">Developer</option>
          <option value="RefundManager">Refund Manager</option>
          <option value="Staff">Staff</option>
          <option value="SubAdmin">Sub Admin</option>
          <option value="Support">Support</option>
        </select>
        <button type="submit">Invite</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
