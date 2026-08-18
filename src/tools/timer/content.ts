import type { ToolContent } from "@/config/tool-content";

export const timerContent: ToolContent = {
  steps: [
    "Pick a preset, or type a duration — 90 for ninety minutes, 1:30 for ninety seconds, 1h30m for either.",
    "Press start. The tab title shows the countdown, so you can work in another window.",
    "An alarm sounds when it finishes. Switch to the stopwatch tab to time something instead.",
  ],
  notes: [
    "Most browser timers drift, and the reason is always the same: they add a second to a running total every time a `setInterval` callback fires. That callback is always a little late, the lateness accumulates, and browsers deliberately throttle intervals in background tabs — often to once a second, sometimes to once a minute. A ten-minute timer left in a background tab can finish several minutes late.",
    "This one stores the moment it should end and subtracts the current time on every tick. However irregularly the tick arrives, and however aggressively the browser throttles it, the number shown is the real number. The tab title shows the countdown too, so a throttled background tab still tells you where you are.",
    "The alarm is generated rather than played from a file — a pair of sine tones from the Web Audio API, repeated a few times. Nothing to download, and no autoplay problem, because the audio is created by the same press that starts the timer, which is what browsers require. If you have granted notification permission, you get a desktop notification as well.",
    "The stopwatch records laps with the fastest and slowest highlighted, which is the only part of a lap list anyone actually reads.",
    "Everything runs in your browser and nothing is stored anywhere. Closing the tab loses the timer, which is the honest trade for a tool that needs no account.",
  ],
  faq: [
    {
      question: "Will the countdown stay accurate in a background tab?",
      answer: "Yes, and it stays accurate. It works from the time it should finish rather than counting ticks, so browser throttling in a background tab cannot make it run slow. The tab title shows the remaining time so you can see it without switching back.",
    },
    {
      question: "How do I set a 5 minute timer?",
      answer: "Press the 5 min preset, or type 5 in the duration box — a bare number is read as minutes. For five seconds, type 0:05 or 5s.",
    },
    {
      question: "Why does typing 90 give ninety minutes rather than ninety seconds?",
      answer: "Because that is what people mean when they type a bare number into a timer. For ninety seconds, type 1:30 or 90s — both work.",
    },
    {
      question: "Will the alarm sound if my phone is locked?",
      answer: "Probably not. Mobile browsers suspend audio for backgrounded pages, and no web page can reliably wake a locked phone. For anything you must not miss, use your phone's own clock app.",
    },
    {
      question: "Does it need an account or an internet connection?",
      answer: "Neither. Once the page has loaded it runs entirely in your browser — you can disconnect and it will keep going.",
    },
  ],
};
