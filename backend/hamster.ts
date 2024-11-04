#!/usr/bin/env -S deno run --allow-run

import $ from "@david/dax";

export async function getHamsterReport(
  begin: string,
  end: string,
  ignore?: string | null,
) {
  if ((await Deno.permissions.query({ name: "run" })).state !== "granted") {
    throw new Error(`Missing Deno run permission"`);
  }
  const hamsterReport = await $`hamster export tsv ${begin} ${end}`.lines();
  return hamsterReport
    .slice(1)
    .filter((line) => line)
    .map((line) => {
      const [comment, date, , minutes, category] = line.split("\t");
      return { comment: `${comment}@${category}`, date, minutes };
    })
    .filter(({ comment }) => !ignore || !comment || !comment.match(ignore))
    .map(({ comment, date, minutes }) => {
      return {
        comment,
        date: date?.substr(0, 10),
        hours: Math.round((100 * parseFloat(minutes)) / 60) / 100,
      };
    });
}

if (import.meta.main) {
  console.log(await getHamsterReport("2020-01-01", "2020-12-31"));
}
