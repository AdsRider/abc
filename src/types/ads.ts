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

export type SaveAdsResultBody = {
  ads_id: number;
  path: any;
  meters: number;
  start_time: number;
  end_time: number;
};

export type SaveAdsResultDAO = SaveAdsResultBody & {
  hash: string;
  reward: string;
  user_email: string;
}
