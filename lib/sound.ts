export type SoundSettings = {
  music: boolean;
  effects: boolean;
  volume: number;
};
export const audioAssets = {
  music: "/audio/steppe-ambience.wav",
  reward: "generated:oscillator",
};
export function playEffect(settings: SoundSettings) {
  if (!settings.effects) return;
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.frequency.setValueAtTime(440, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    880,
    ctx.currentTime + 0.15,
  );
  gain.gain.setValueAtTime(settings.volume * 0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.3);
  oscillator.onended = () => void ctx.close();
}
