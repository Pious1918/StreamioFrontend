declare module 'shaka-player' {
    export class Player {
      constructor(video: HTMLVideoElement);
      // Add other methods and properties you plan to use
      load(manifestUri: string, startTime?: number, options?: object): Promise<void>;

    }
  }
  