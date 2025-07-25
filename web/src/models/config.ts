export interface Config {
  meta?: {
    title?: string;
    description?: string;
    keywords?: Array<string>;
    footer?: string;
  };
  auth?: {
    is_registration_enabled?: boolean;
  };
  captcha?: {
    provider?: "none" | "pow" | "image" | "turnstile" | "hcaptcha";
    difficulty?: number;
    turnstile?: {
      url?: string;
      site_key?: string;
      secret_key?: string;
    };
    hcaptcha?: {
      url?: string;
      site_key?: string;
      secret_key?: string;
      score?: number;
    };
  };
  email?: {
    is_enabled?: boolean;
    host?: string;
    port?: number;
    tls?: "starttls" | "tls" | "none";
    username?: string;
    password?: string;
    whitelist?: Array<string>;
  };
}

export interface Version {
  tag?: string;
  commit?: string;
}

export interface Statistics {
  users?: number;
  games?: number;
  challenges?: {
    total?: number;
    in_game?: number;
  };
  submissions?: {
    total?: number;
    solved?: number;
  };
}
