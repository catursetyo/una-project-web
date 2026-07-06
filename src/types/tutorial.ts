type TutorialStep = {
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

export type ApiTutorialStep = {
  id?: string;
  step_number: number;
  title: string;
  description: string;
  highlight?: string;
};

export type ApiTutorial = {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  video_url?: string;
  is_active: boolean;
  order_index: number;
  created_at?: string;
  steps: ApiTutorialStep[];
};
