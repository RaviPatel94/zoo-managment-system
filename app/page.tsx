import { AuthForm } from "@/components/auth/auth-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800">Zoo Management System</h1>
          <p className="text-emerald-600 mt-2">Manage your zoo with ease and efficiency</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}

