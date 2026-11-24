declare module "aos" {
  export interface AOSOptions {
    duration?: number;
    easing?: string;
    once?: boolean;
    offset?: number;
    delay?: number;
    mirror?: boolean;
  }

  export interface AOS {
    init(options?: AOSOptions): void;
    refresh(): void;
    refreshHard(): void;
    pause(): void;
    disable(): void;
  }

  const AOS: AOS;
  export default AOS;
}
