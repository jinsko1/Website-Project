---
title: "JAMA on how to read clinical trials"
date: "2026-05-27"
categories: 
    - "Medicine"
type: posts
slug: "jamaseries"
url: "/blog/jamaseries/"
aliases: ["/blog/jamaseries.html"]
---
There's a series from JAMA that goes over how to read clinical trials. The series is written by individuals who are widely recognized in the field of evidence-based medicine. The entire series is a valuable resource for navigating literature in general, but there's a total of six relevant parts to the series, specifically on how to read clinical trials:

I: [how to get started](https://jamanetwork.com/journals/jama/article-abstract/409068) [@oxmanUsersGuidesMedicala]
II-A: [validity of therapy/prevention studies](https://jamanetwork.com/journals/jama/article-abstract/409494) [@sackettUsersGuidesMedical]
II-B: [results and whether they help your patients](https://jamanetwork.com/journals/jama/fullarticle/361625) [@sackettUsersGuidesMedicala]
XIX-A: [surrogate endpoints](https://jamanetwork.com/journals/jama/fullarticle/191311)
XIX-B: [drug class effect](https://jamanetwork.com/journals/jama/fullarticle/191982)\

I'm skipping a few parts because they're rather long and irrelevant to clinical trials. I'm not interested. Part 1 is not worth talking about since it merely orients you to the series, save the table below which is a pithy summary of the series.

![](/blog/images/clinicaltrial.png){fig-cap="Guide to reading clinical trials from JAMA"}

# Part II-A: Are the Results of the Study Valid?

Make sure the trial in question is a randomized controlled trial (RCT). This is the gold standard for clinical trials and helps minimize bias.

> The beauty of randomization is that it assures, if sample size is sufficiently large, that both known and unknown determinants of outcome are evenly distributed between treatment and control groups.

A well-designed trial should also include a complete follow-up of patients to account for bias. Patients who dissapear may have different outcomes than those who remain in the study, which can skew results.

> Readers can decide for themselves when the loss to follow-up is excessive by assuming, in positive trials, that all patients lost from the treatment group did badly, and all lost from the control group did well, and then recalculating the outcomes under these assumptions.

Upon further reading the article, a strange point was made:

> As in routine practice, patients in randomized trials sometimes forget to take their medicine or even refuse their treatment altogether. Readers might, on first blush, agree that such patients who never actually received their assigned treatment should be excluded from analyses for efficacy. Not so.

As the authors state, I found this quite strange. If you want to evaluate the efficacy of a therapy, the noncompliant patient seems like noise, since they did not take the treatment. However, the authors argue that excluding noncompliant patients can bias results, as it may not reflect real-world scenarios in which patients often do not adhere to treatment. The principle is to retain prognostic factors, known and unknown.

Good studies should also be double-blinded. Very simple. This helps minimize bias in reporting and assessing outcomes. Of course, this comes with its nuances; recently there was a trial in the literature describing vagus nerve stimulation for the reduction of inflammation in rheumatoid arthritis, purportedly double-blinded [@tesserVagusNervemediatedNeuroimmune2026]. Now this was a device implanted that sent electrical impulses to the vagus nerve. The problem is that the device may produce perceptible sensations, which could unblind patients and investigators. So even though the study was technically double-blinded, it may not have been truly blinded.

# Part II-B: What are the Results and How Can They Help My Patients?

The previous article was devoted solely to whether the results of a trial were valid. II-B is devoted to whether the valid results help a patient.

## Representing Treatment Effect

Couple ways of representing the treatment effect that the article lists:

**Abolute risk reduction (ARR)** is the difference in event rates between the control and treatment groups.

$$
ARR = control\_event\_rate - experimental\_event\_rate

$$

For example, if 10% of patients in the control group have an event and 5% in the treatment group have an event, the ARR is 5%.

$$
ARR = 0.10 - 0.05 = 0.05

$$

**Relative risk (RR)** is self explanatory. It is the ratio of the event rate in the treatment group to the event rate in the control group.

$$
RR = \frac{EER}{CER}

$$

**Relative risk reduction (RRR)** is merely the complement of the relative risk:

$$
RRR = 1 - RR

$$

Many trials usually use RRR to report treatment effect.

## Precision of the Treatment Effect

Confidence intervals (CIs) are discussed. If the CI is wide, the treatment effect is imprecise. No use in relying on a treatment effect that is not precise. For example, if the RRR is 25%, derived from a difference of just 5 patient deaths (which is quite a small difference) with a relatively small sample size, the CI may be wide and the treatment effect imprecise. By the same token, with a larger sample size, the CI narrows and the effect more precise.

But of course, in a positive trial, whether the lower bound of the CI is clinically meaningful is a decision that must be made by the physician.

However, in an negative trial—one in which the experimental treatment was not proven to be superior to the control—the upper bound of the CI is important. If the upper bound is clinically meaningful, then the trial failed to exclude an important treatment effect, one which may have been beneficial to patients.

## Does the Treatment Effect Apply to My Patient?

If the patient qualifies for the trial, then the treatment effect likely applies. If not, clinical judgment is required.

The article then also talks about surrogate endpoints and drug class effects but I want to leave that for a later post. It is a subject that interests me greatly and hence deserves its own space. As such, even though the post includes both articles, I will not discuss it here.

## Number Neeed to Treat (NNT)

NNT is a metric used to understand the practical implications of a treatment effect: the number of patients that need to be treated with a specific therapy for one patient to benefit compared to a control.

We consider NNT on top of the treatment effect and its precision because its impact on the patient and practice may still remain unclear.

If we need to treat 400 patients to prevent one death, then the NNT is 400. If we need to treat 10 patients to prevent one death, then the NNT is 10. The lower the NNT, the more effective the treatment.

Of course, even if the NNT is high, the treatment may still be worth it if the treatment is cheap and safe. Conversely, if the NNT is low but the treatment is expensive or has significant side effects, then it may not be worth it.
