---
title: "RSS Feeds"
date: "2026-02-23"
categories: 
    - "Medicine"
type: posts
slug: "rss"
url: "/blog/rss/"
aliases: ["/blog/rss.html"]
---


So far I've subscribed to a couple journals and some blogs. Here's a partial list:

- [CDC MMWR](https://www.cdc.gov/mmwr/index.html)
- Phase 3 and 4 clinical trials from:
    - BMJ
    - NEJM
    - The Lancet
- Blogs from:
    - [Sensible Medicine](https://www.sensible-med.com/)
    - [The Vajenda](https://vajenda.substack.com/)
    - [The Anesthesia Consultant](https://theanesthesiaconsultant.com/)
    - [Precious Bodily Fluids](https://pbfluids.com/)
    - [Stop and Think](https://johnmandrola.substack.com/)
    - [Vinay Prasad's Observations and Thoughts](https://www.drvinayprasad.com/)
    - [The Skeptical Cardiologist](https://theskepticalcardiologist.substack.com/)

The NIH walks you through how to set up filtered RSS feeds for pubmed: [NIH RSS Feeds](https://www.nlm.nih.gov/pubs/techbull/ja20/ja20_pubmed_updated.html). This is how I obtained the feeds for phase 3 and above.

You can use an RSS feed locally, but I decided to run an RSS server using [FreshRSS](https://freshrss.org/) and package it with [Docker](https://www.docker.com/) (I wanted a server so that I could sync across devices). This runs on my PC at home. I then used [Tailscale](https://tailscale.com/) to access it from my other devices. It works beautifully.