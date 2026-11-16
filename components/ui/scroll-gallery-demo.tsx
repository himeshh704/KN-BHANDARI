"use client";

import { ScrollGallery } from "./scroll-gallery";

// Real archival photo layers without invented names or assumptions
const slides = [
  {
    image: "./assets/images/client/kn-authentic-1.jpg",
    url: "./archive.html",
    linkLabel: "View Archive",
  },
  {
    image: "./assets/images/client/kn-authentic-2.jpg",
    url: "./archive.html",
    linkLabel: "View Archive",
  },
  {
    image: "./assets/images/client/kn-authentic-3.jpg",
    url: "./archive.html",
    linkLabel: "View Archive",
  },
  {
    image: "./assets/images/client/kn-authentic-5.jpg",
    url: "./archive.html",
    linkLabel: "View Archive",
  },
];

export default function ScrollGalleryDemo() {
  return (
    <div className="w-full h-screen bg-[#110507]">
      <ScrollGallery
        slides={slides}
        variant="studio"
        prefixLabel="Archival Gallery"
        showInfoBand={true}
      />
    </div>
  );
}

export { ScrollGalleryDemo };
