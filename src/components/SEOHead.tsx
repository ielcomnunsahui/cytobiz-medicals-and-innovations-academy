import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "course";
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

const BASE_URL = "https://cytobizacademy.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "Cytobiz Medical Academy";

export function SEOHead({
  title,
  description = "Practical, innovation-driven medical education for healthcare professionals. Expert-led courses in digital health, public health, and clinical excellence.",
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  keywords = [],
  author,
  publishedTime,
  modifiedTime,
  noindex = false,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Medical Education & Innovation`;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const fullImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;
  
  const defaultKeywords = [
    "medical education",
    "healthcare innovation",
    "digital health",
    "public health courses",
    "medical training",
    "healthcare professionals",
    "online medical courses",
  ];
  
  const allKeywords = [...new Set([...keywords, ...defaultKeywords])].join(", ");

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      {author && <meta name="author" content={author} />}
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Article specific (for courses) */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@CytobizAcademy" />

      {/* Schema.org JSON-LD for courses */}
      {type === "course" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: title,
            description: description,
            provider: {
              "@type": "Organization",
              name: SITE_NAME,
              url: BASE_URL,
            },
            url: fullUrl,
            image: fullImage,
          })}
        </script>
      )}
    </Helmet>
  );
}
