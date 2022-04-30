export {};

declare global {
  type LoginRequest = {
    email: string;
    password: string;
  };

  type RegisterRequest = {
    name: string;
    email: string;
    password: string;
  };

  type UserInfo = {
    email: string;
    name: string;
    oilType: Nullable<OilType>;
    card: Nullable<string>;
    navi: Nullable<string>;
  };

  type KakaoAuthUser = {
    scopes: string[];
    refreshTokenExpiresAt: Date;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    accessToken: string;
  };
}
