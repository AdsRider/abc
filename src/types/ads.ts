export type Ads = {
  id: string;
  title: string;
  subtitle: string;
  reward: string;
  image_id: number;
  start_date: string;
  end_date: string;
  user_email: string;
};

export type AdsDAO = Omit<Ads, 'id'>;

