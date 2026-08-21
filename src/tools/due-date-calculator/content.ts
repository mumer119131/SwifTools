import type { ToolContent } from "@/config/tool-content";

export const dueDateCalculatorContent: ToolContent = {
  steps: [
    "Choose what you are working from — last period, conception date, or an IVF transfer.",
    "Enter the date, and your usual cycle length if it is not 28 days.",
    "Read the estimate, how far along you are, and the milestones ahead.",
  ],
  notes: [
    "Naegele's rule — last period plus 280 days — is what clinics use, and it carries an assumption worth stating plainly: that ovulation happened on day 14 of a 28-day cycle. Plenty of people do not have 28-day cycles, and a longer one means later ovulation and a later due date. Entering your actual cycle length adjusts for that rather than treating everyone as average.",
    "The word estimated is doing real work. Only about 4% of babies arrive on their due date, and full term spans five weeks — from 37 to 42 weeks. A single date presented without that context sets an expectation that is wrong far more often than it is right, which is why the term window is shown alongside it.",
    "IVF dates are the exception, and the most accurate input here. A day-5 transfer fixes the timeline precisely, so cycle length is irrelevant and the estimate is correspondingly better. The same is true of a known conception date.",
    "The convention that confuses everyone: pregnancy is counted from the first day of your last period, roughly two weeks before conception. So at four weeks pregnant, the embryo is about two weeks old. It is measured that way because the last period is a date people know and ovulation usually is not.",
    "A dating scan is more accurate than any calculation, particularly with an irregular cycle, and it is what your midwife or doctor will actually use. This is arithmetic, not a medical assessment — and nothing you enter is sent anywhere.",
  ],
  faq: [
    {
      question: "How is a due date calculated?",
      answer: "280 days — forty weeks — from the first day of your last period. That is Naegele's rule, and it assumes ovulation on day 14 of a 28-day cycle. A longer cycle means later ovulation and a later date, which is why cycle length is worth entering.",
    },
    {
      question: "How accurate is a due date?",
      answer: "Only about 4% of babies arrive on the date itself. Anything from 37 to 42 weeks is full term — a five-week window — so treat the date as the middle of a range rather than an appointment.",
    },
    {
      question: "Why does pregnancy count from before conception?",
      answer: "Because the last period is a date people know and the moment of ovulation usually is not. It means that at four weeks pregnant the embryo is roughly two weeks old, which surprises almost everyone the first time.",
    },
    {
      question: "How does an IVF due date differ?",
      answer: "It is more accurate, because the timeline is known rather than inferred. A day-5 transfer is counted as 19 days after the notional last period and a day-3 transfer as 17 — and cycle length does not enter into it.",
    },
    {
      question: "Should I rely on this instead of a scan?",
      answer: "No. A dating scan is more accurate than any calculation, especially with an irregular cycle, and it is what your midwife or doctor will use. This is useful for planning, not for medical decisions.",
    },
  ],
};
