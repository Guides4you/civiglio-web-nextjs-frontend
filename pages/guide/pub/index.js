// Redirect to home page
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/guide/pub/home',
      permanent: false,
    },
  };
}

export default function GuidePubIndex() {
  return null;
}
