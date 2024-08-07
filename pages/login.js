import { getProviders, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function LoginPage({ providers }) {
  const { data, status } = useSession();
  const router = useRouter();

  // Redirect if the user is already logged in
  if (status === 'loading') {
    return <div>Loading...</div>; // Provide loading feedback
  }
  if (data) {
    router.push('/'); // Correctly redirect to the home page
  }

  if (!providers) {
    return <div>Error: No providers found</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {Object.values(providers).length > 0 ? (
        Object.values(providers).map(provider => (
          <div key={provider.id} className="mb-4">
            <button 
              onClick={async () => await signIn(provider.id)}
              className="bg-twitterWhite pl-3 pr-5 py-2 text-black rounded-full flex items-center"
            >
              <img src="/google.png" alt="" className="h-6 mr-2" />
              Sign in with {provider.name}
            </button>
          </div>
        ))
      ) : (
        <div>No providers available</div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const providers = await getProviders();
    return {
      props: { providers },
    };
  } catch (error) {
    console.error('Error fetching providers:', error);
    return {
      props: { providers: null },
    };
  }
}
