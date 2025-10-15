import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark dark:text-white">
            Join Encore
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create your account to start buying and selling
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary-dark text-sm normal-case',
              card: 'shadow-none border border-gray-200 dark:border-gray-800',
              headerTitle: 'text-dark dark:text-white',
              headerSubtitle: 'text-gray-600 dark:text-gray-400',
              socialButtonsBlockButton: 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
              formFieldInput: 'border border-gray-300 dark:border-gray-700 focus:border-primary',
              footerActionLink: 'text-primary hover:text-primary-dark'
            }
          }}
        />
      </div>
    </div>
  );
}
