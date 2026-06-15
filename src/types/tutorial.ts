export type TutorialStep = {
  title: string;
  description: string;
  highlight?: string;
};

export type Tutorial = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  steps: TutorialStep[];
  videoUrl?: string;
};
