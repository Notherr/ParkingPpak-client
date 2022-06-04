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
    jwt: string;
    card: Nullable<string>;
    naviType: Nullable<NavigationType>;
    oilType: Nullable<OilType>;
  };

  type KakaoAuthUser = {
    scopes: string[];
    refreshTokenExpiresAt: Date;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    accessToken: string;
  };
}
