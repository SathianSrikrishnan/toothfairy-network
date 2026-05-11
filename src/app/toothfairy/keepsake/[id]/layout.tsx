import type { Metadata } from 'next';
import { getKeepsakeData } from '@/lib/toothfairy/keepsake-data';

type KeepsakeMetadataProps = {
  params: { id: string };
};

function fallbackChildName(name?: string | null) {
  const trimmed = name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : 'A little one';
}

export async function generateMetadata({
  params,
}: KeepsakeMetadataProps): Promise<Metadata> {
  const data = await getKeepsakeData(params.id);
  const childName = fallbackChildName(data?.childName);
  const title = `${childName}'s tooth memory`;
  const description = data?.toothStory
    ? `${childName}'s tooth story and Toothlight memory are saved on the Tooth Fairy Network.`
    : `${childName}'s Toothlight memory is saved on the Tooth Fairy Network.`;
  const pageUrl = `/toothfairy/keepsake/${params.id}`;
  const imageUrl = `/toothfairy/keepsake/${params.id}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Tooth Fairy Network',
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${childName}'s Tooth Fairy Network keepsake`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function KeepsakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
