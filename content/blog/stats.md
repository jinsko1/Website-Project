---
title: "Lessons from Basic Statistics for Clinicians"
subtitle: "Part 1: Hypothesis Testing"
date: "2026-08-23"
type: posts
---

Uncertainty comes with a study of modest power—one that does not produce a result below the 0.05 significance threshold but may still, in reality, reflect a lower mortality rate. The possibility of missing a true difference (a type II error) between two arms decreases as the sample size increases. As such, even when a trial is considered negative, a reader ought to note the power of the trial. This becomes even more important when constructing equivalence studies, where a new treatment supported by an inadequately powered study showing equivalence may, in fact, be worse than the standard therapy in terms of cost and toxicity[^ref-stats1].

The dangers of using multiple tests on the same sample to measure multiple endpoints are also discussed. When hypothesis testing across several endpoints—assuming that there are truly no differences between the groups on any endpoint—any statistically significant result would be a false positive. Unfortunately, this can be quite common. The paper illustrates this by comparing two samples on six endpoints. Assuming the tests are independent, the probability that all six endpoints do not cross the 0.05 significance threshold is 0.95 raised to the sixth power, or approximately 0.74. Thus, the probability that at least one of the six endpoints falls below the 0.05 threshold is approximately 0.26 (1 − 0.74), which is rather large; roughly 1 in 4 such sets of tests would produce at least one false positive.

To correct for this, the paper proposes dividing the typically accepted significance threshold by the number of tests (0.05/6 = 0.008), but I am rather skeptical of this method and will do further reading from statisticians. The authors also propose specifying a single primary endpoint or combining multiple endpoints into a global endpoint for testing.

[^ref-stats1]: Guyatt G, Jaeschke R, Heddle N, Cook D, Shannon H, Walter S. Basic statistics for clinicians: 1. Hypothesis testing. CMAJ. 1995 Jan 1;152(1):27-32. PMID: 7804919; PMCID: PMC1337490.
