# Äripäeva palgaturu analüüs

How to run the project:

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
After this, you should be able to see the project running on http://localhost:3000.

For AI analysis, you need to have an OpenAI API key. This needs to be added to the .env file under the NEXT_PUBLIC_OPENAI_API_KEY variable. There is a variable in `ai-analysis.tsx` that you can use to toggle the AI analysis on and off.

Technologies used:

<details>
<summary>Next.js</summary>
I went with Next.js because I've used it before and it's a good framework.
This project has a relatively static nature, so I don't need to use server components and so the site can be server-side rendered.
</details>

<details>
<summary>Tailwind CSS</summary>
I have used Tailwind CSS a lot recently and I've grown to like it.
It makes styling a lot easier and faster, without having to jump between files.
</details>

<details>
<summary>Shadcn/ui</summary>
This was my first time using Shadcn. It's an interesting component library.
I really like the style of it, and it seems to have a lot of useful components, but what's odd is that many of the components seem to be maintained by some third-party. Not exactly sure how stable that can be, but many people seem to like it nonetheless.
It is kinda nice that adding components also adds the base code to your project, which allows you to customize it way better than you could customize other component libraries.
</details>

<details>
<summary>OpenAI</summary>
ChatGPT (GPT-3.5 Turbo) is used for salary analysis. Obviously it's a very powerful tool and I think that this project could definitely utilize it even more. It's amazing to see how well it can summarize some analysis together and even output it straight to Estonian without needing to translate it.
</details>

<details>
<summary>NixOS</summary>
This is my OS. I'm using NixOS because it's a very powerful tool for managing dependencies and packages.
This is where the `flake.nix` and `flake.lock` files come in. They're essentially like Docker files but more on an OS level.
Those files don't really matter unless you're using Nix.
</details>

Everything under `components/ui` is from Shadcn.
Everything under `app/components` is built by me.


This was a pretty fun project to work on.
If I were to spend more time on it I'd make it way more insightful.
There is possibility of adding more info to the graph, like another line showcasing the medium/median salary across Estonia, so that you could see whether you're earning above or below it. There could also be a toggle that toggles between a regular graph and an inflation-adjusted graph.

There could also be better data sources. While Statistics Estonia most likely has the best (and most) statistics on this subject, querying the data seems a bit tricky. I had to spend a day looking into exactly what and how I could query the data I need from Statistics Estonia, and I'm not satisfied with the current result. Mainly, the occupation categories are way too broad, they could be just a little bit more specific. I know that EMTAK exists, but I also wouldn't want it to be too specific. There's a hard balance to strike.
There is also a possibility of a better statistics resource/API that I didn't see.

As for the inflation calculation, [right now it's hardcoded to be 3.2%](https://github.com/Box-Bop/aripaev-palgaruru-analuus/blob/840c021dae9eab662b18ec77ac9e7924e5e79c8f/app/lib/salary-calculations.ts#L35), which obviously isn't the most accurate. This can also be improved, fed into the graph and AI for a better analysis.

It would also be interesting to allow ChatGPT to point towards some spots on the graph. I noticed that in many categories, the average salary dropped a bit at the beginning of each year, clearly hinting towards the pattern of company layoffs at the end of each year.


I usually keep this default section in because it contains links to documentation I might need:
<details>
<summary>Default Next.js README</summary>

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

</details>
