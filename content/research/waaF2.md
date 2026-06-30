---
title: "Proposed Assay for CA Supplementation"
date: "2026-06-30"
type: posts
categories: 
    - "Yep Lab"
---

The following tests the hypothesis that the nonswarming strain fails to swarm under an immobilizing lack of surfactant. Provided this is true, external supplementation of CA should rescue the nonswarming phenotype. [Context]({{< relref "9-17-2025.md" >}}) provided.

We already know that the nonswarming strain is swimming capable as shown in the Keio knockout paper[^ref-k12paper]. What proceeds then logically follows: extraction of CA from ∆waaF; verification of CA presence and cell absence; supplementation of CA to surface of agar plate; nonswarming strain inoculation; swarming observation with the following controls: CA-rich, CA-negative, and vehicle controls.

But before proceeding any further with the above workflow, as this would be a meticulous and costly collection of experiments, verification of whether this assay warrants my time is necessary, so I will perform a rudimentary experiment before proceeding any further.

In the rudimentary experiment, I will simply be mixing the two strains. The nonswarming strain is flagellated while ∆waaF is not, as flagella biosynthesis is inhibited[^ref-Hwang]; hence, any motility akin to swarming can be attributed to the nonswarmer. I consider this experiment rudimentary for it will not immediately prove anything conclusive. I do not prove in any meaningful way that it is indeed CA allowing rescue of the negative phenotype. Accordingly, this experiment will be rudimentary—at best.

I will delay posting the thorough procedure as I find it unecessary to unambiguate it at the the current moment.

| Treatment        | Inoculum Composition    | Purpose                   | Expected Result                                      | Interpretation                                                                                                                                                |
| ---------------- | ----------------------- | ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WT CFT073 alone  | WT CFT073 only          | Positive swarming control | Swarming observed                                    | Confirms that the swarm plates are permissive for CFT073 swarming.                                                                                            |
| Nonswarmer alone | ∆tolC / nonswarmer only | Negative baseline         | No swarming or severely reduced swarming             | Confirms the phenotype being tested.                                                                                                                          |
| ∆waaF alone      | ∆waaF only              | Donor-only control        | No true swarming; possible mucoid/lopsided expansion | Determines whether ∆waaF produces misleading spreading by itself.                                                                                             |
| Mixed inoculum   | Nonswarmer + ∆waaF      | Main rudimentary test     | Swarm-like expansion greater than nonswarmer alone   | Suggests ∆waaF enables surface movement by the flagellated nonswarmer. This justifies the full CA-extract rescue assay but does not prove CA-specific rescue. |


## References

[^ref-k12paper]: Inoue, Tetsuyoshi, Ryuji Shingaki, Shotaro Hirose, Kaori Waki, Hirotada Mori, and Kazuhiro Fukui. 2007. “Genome-Wide Screening of Genes Required for Swarming Motility in Escherichia Coli K-12.” Journal of Bacteriology 189 (3): 950–57. https://doi.org/10.1128/JB.01294-06.

[^ref-Hwang]: Hwang, YuneSahng, Marta Perez, Rebecca Holzel, and Rasika M. Harshey. 2025. “C-Di-GMP Is Required for Swarming in E. Coli: A Role for DgcO and Colanic Acid.” Preprint, February 5. https://doi.org/10.1101/2025.01.04.631324.
