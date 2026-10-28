/** Client reviews shown on the home page, copied from the studio's Google profile. */
export interface Review {
  name: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Short theme pulled from the review text, shown as a tag on the card. */
  highlight: string;
}

export { GOOGLE_RATING, REVIEW_COUNT } from "@/data/business";

export const reviews: Review[] = [
  {
    name: "Gopinath Talluri",
    rating: 5,
    highlight: "Anniversary gift",
    // Text as pasted from Google was cut off mid-sentence; ends at the last complete phrase.
    quote:
      "I got my first-ever tattoo at Xing Premium Tattoo Studio as an anniversary gift for my lovely wife, and it was a great experience. I chose this studio after reading their positive reviews, and they truly lived up to them. The tattoo artist was very kind, patient…",
  },
  {
    name: "Pratiksha Goswami",
    rating: 5,
    highlight: "Aftercare guidance",
    quote:
      "I got two small tattoos on my arm, and the tattoo artist, Peace, was incredibly humble, professional, and caring. He made me feel comfortable throughout the session, so I didn't have to worry about anything. He also explained the aftercare in detail and gave me helpful tattoo care advice.",
  },
  {
    name: "Surya Suresh",
    rating: 5,
    highlight: "First tattoo",
    quote:
      "Came for my very first tattoo and the service and care and Mr Peace was excellent. The design came out amazing.",
  },
  {
    name: "Krishna DJ",
    rating: 5,
    highlight: "Clean & professional",
    quote:
      "Great experience overall. The studio was clean and professional, and the artist, Peace, was extremely skilled and patient. He understood exactly what I wanted and delivered a perfect result. Really happy with the tattoo… highly recommend!",
  },
  {
    name: "J P Rai",
    rating: 5,
    highlight: "First tattoo",
    quote:
      "Got my first tattoo here and I was a bit nervous, but the artist made the whole process smooth and comfortable. The detailing, hygiene, and overall vibe were top-notch. The design turned out exactly how I imagined (even better!). Thank you for such an amazing experience!",
  },
  {
    name: "Prajosh Prabhakaran",
    rating: 5,
    highlight: "Great consultation",
    quote:
      "I got my tattoo done yesterday, it was great experience. The consultation was good by Peace. Overall I had great experience.",
  },
  {
    name: "Ravi Bhatt",
    rating: 5,
    highlight: "Comfortable session",
    quote:
      "I got my first tattoo in my life. I was very scared at first, but brother did it so beautifully that it didn't hurt at all. I will come back for more tattoos.",
  },
  {
    name: "Navya Jyoti",
    rating: 5,
    highlight: "Precise work",
    quote:
      "Got an amazing tattoo at Xing Studio today, super clean and precise work. Peace is very talented! Highly recommend!!",
  },
];
