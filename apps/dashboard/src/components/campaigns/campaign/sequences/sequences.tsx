import {Sequence, TSequence} from "@/components/campaigns/campaign/sequences/sequence";

import React from "react";

export function Sequences(
	{
		sequences = [],
	}: {
		sequences?: TSequence[];
	}) {


	return (
		<ul>
			{sequences.map((sequence, k) => (
				<li key={sequence.sequence.id} className={"mb-6 last:mb-0 "}>
					<Sequence
						{...sequence}
					/>
				</li>
			))}
		</ul>
	);
}
