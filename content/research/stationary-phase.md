---
title: "LB, ∆fur, and Stationary Phase"
date: "2025-10-03"
type: posts
categories: 
    - "Yep Lab"
slug: "stationary-phase"
url: "/research/stationary-phase/"
aliases: ["/research/stationary-phase.html"]
---
Dr. Yep noticed how *∆fur* stalled earlier than the other strains. It’s not necessarily a problem, but I’d like to understand the cause. The paper should also explain this, so we’ll need the rationale anyway.

*∆fur* entered stationary phase early in Lysogeny Broth (LB). This didn’t happen with any of the other strains or media. *Why*? I’ll attempt to explain this in a few ways.

# ROS Damage

Since this phenomenon was absent in all other media, I think the early stalling most likely reflects a specific interaction between the high intracellular iron characteristic of *∆fur*, and some inherent property of LB.

There appears to be commercial variance in background ROS in LB. LB (Sigma) tends to have more H<sub>2</sub>O<sub>2</sub> than LB (Difco), which is generally gentler (I’m fairly confident we use Sigma). Together with constitutively elevated intracellular iron (Fenton reaction), *∆fur* may also be exposed to higher levels of peroxide, causing ROS damage. Components such as riboflavin, reducing sugars, and transition metal ions—present in LB—can generate ROS depending on storage conditions, especially with light exposure[^ref-ezratyCommercialLysogenyBroth2014].

Note that *∆fur* is easily pushed into oxidative stress as well. Deletion of *fur* indirectly represses *sodB*, which encodes iron superoxide dismutase. This enzyme acts as an antioxidant, preventing ROS damage. But in *∆fur*, this antioxidant is repressed. Cells must then rely on the product of *sodA* (manganese superoxide dismutase), and, unfortunately, if Mn is lacking in the environment, there isn’t much the cell can do to prevent ROS damage[^ref-chareyreBacterialIronHomeostasis2018].

Side note: although it wasn’t exactly stationary phase, there was some growth inhibition with *∆fur* in swarming medium as well. Both LB and swarming medium contain yeast extract, which may include components necessary for ROS generation. Of course, this perceived symmetry may be coincidental, and some other intrinsic characteristic attributable to the mutation may be at play; I’m only speculating.

# pH Threshold

The effect seen in *∆fur* is most likely due to various reasons in combination, including pH damage. One other thing I suspect is the pH threshold of *E. coli* since LB isn’t really buffered, so left alone, growth can take the media up to a pH of 9 without glucose (swarming media has glucose, which may be why CFT doesn’t top out in swarming media.) Excretion of excess ammonia is to blame for the alkalinization[^ref-sezonovEscherichiaColiPhysiology2007].

# Carbon Exhaustion

This one is pretty simple. Since LB is pretty limited terms of its nutrient content, lack of carbon sources in combination with the preceding reasons may account for the early stalling observed for *∆fur* in LB[^ref-sezonovEscherichiaColiPhysiology2007].

## References

[^ref-ezratyCommercialLysogenyBroth2014]: Ezraty, Benjamin, Camille Henry, Marion Hérisse, Erick Denamur, and Frédéric Barras. 2014. “Commercial Lysogeny Broth Culture Media and Oxidative Stress: A Cautious Tale.” *Free Radical Biology and Medicine* 74 (September): 245–51. <https://doi.org/10.1016/j.freeradbiomed.2014.07.010>.
[^ref-chareyreBacterialIronHomeostasis2018]: Chareyre, Sylvia, and Pierre Mandin. 2018. “Bacterial Iron Homeostasis Regulation by sRNAs.” *Microbiology Spectrum* 6 (2): 10.1128/microbiolspec.rwr-0010-2017. <https://doi.org/10.1128/microbiolspec.rwr-0010-2017>.
[^ref-sezonovEscherichiaColiPhysiology2007]: Sezonov, Guennadi, Danièle Joseleau-Petit, and Richard D’Ari. 2007. “Escherichia Coli Physiology in Luria-Bertani Broth.” *Journal of Bacteriology* 189 (23): 8746–49. <https://doi.org/10.1128/jb.01368-07>.
