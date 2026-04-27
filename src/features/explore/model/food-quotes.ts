export type LocalizedFoodQuote = {
  id: string;
  text: {
    en: string;
    ar: string;
  };
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const FOOD_QUOTES: LocalizedFoodQuote[] = [
  {
    id: "q-1",
    text: {
      en: "Good food is the foundation of genuine happiness.",
      ar: "الطعام الجيد هو أساس السعادة الحقيقية.",
    },
  },
  {
    id: "q-2",
    text: {
      en: "Cooking is love made visible on a plate.",
      ar: "الطبخ هو الحب عندما يصبح مرئياً على الطبق.",
    },
  },
  {
    id: "q-3",
    text: {
      en: "Simple ingredients can create unforgettable meals.",
      ar: "المكونات البسيطة تستطيع صنع وجبات لا تُنسى.",
    },
  },
  {
    id: "q-4",
    text: {
      en: "A shared meal is one of life's greatest comforts.",
      ar: "الوجبة المشتركة واحدة من أعظم راحات الحياة.",
    },
  },
  {
    id: "q-5",
    text: {
      en: "Fresh food fuels both body and mood.",
      ar: "الطعام الطازج يغذي الجسد والمزاج معاً.",
    },
  },
  {
    id: "q-6",
    text: {
      en: "Every kitchen has a story waiting to be cooked.",
      ar: "في كل مطبخ قصة تنتظر أن تُطهى.",
    },
  },
];

function getDaySerial(date: Date): number {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(localMidnight.getTime() / ONE_DAY_IN_MS);
}

export function getDailyFoodQuote(locale: string, now: Date = new Date()): string {
  const daySerial = getDaySerial(now);
  const index = ((daySerial % FOOD_QUOTES.length) + FOOD_QUOTES.length) % FOOD_QUOTES.length;
  const quote = FOOD_QUOTES[index];
  return locale === "ar" ? quote.text.ar : quote.text.en;
}
