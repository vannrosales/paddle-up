import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pickleball Players Profiling, Achievements, and Role",
    short_name: "PaddleUp",
    description: "Your pickleball profile, achievements, and role in one place.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F2F7",
    theme_color: "#C8F31D",
    icons: [
      {
        src: "/brand/mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

