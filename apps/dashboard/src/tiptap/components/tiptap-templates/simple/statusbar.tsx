import {ProgressCircle} from "#components/charts/curcular-indicator";
import {cn} from "#lib/utils";
import * as React from "react";
import {Badge} from "#components/ui/badge";

import {Editor, useEditorState} from "@tiptap/react";

export function Statusbar({editor}: { editor: Editor | null }) {
	const eState = useEditorState({
		editor,
		selector: context => ({
			charactersCount: context.editor?.storage.characterCount.characters() ?? 0,
			wordsCount     : context.editor?.storage.characterCount.words() ?? 0,
		}),
	});

	if (!eState || !editor) return null;

	const stats = {
		characters : {
			label     : "Characters",
			count     : eState.charactersCount,
			lowLimit  : 1500,
			medLimit  : 1800,
			highLimit : 2000,
			percentage: Math.round((100 / 1500) * eState.charactersCount),
			strokeCls : "text-positive"
		},
		words      : {
			label     : "Words",
			count     : eState.wordsCount,
			lowLimit  : 150,
			medLimit  : 180,
			highLimit : 200,
			percentage: Math.round((100 / 150) * eState.wordsCount),
			strokeCls : "text-positive"
		},
		spamWords  : {
			label     : "Spam words",
			count     : 0,
			lowLimit  : 1,
			medLimit  : 1,
			highLimit : 2,
			percentage: Math.round((100 / 1) * 1),
			strokeCls : "text-positive"
		},
		questions  : {
			label     : "Questions",
			count     : 0,
			lowLimit  : 2,
			medLimit  : 3,
			highLimit : 4,
			percentage: Math.round((100 / 2) * 1),
			strokeCls : "text-positive"
		},
		variability: {
			label     : "Variability",
			count     : 0,
			lowLimit  : 2,
			medLimit  : 3,
			highLimit : 4,
			percentage: Math.round((100 / 2) * 0),
			strokeCls : "text-positive"
		},
		images     : {
			label     : "Images",
			count     : 0,
			lowLimit  : 0,
			medLimit  : 1,
			highLimit : 2,
			percentage: Math.round((100 / 0) * 1),
			strokeCls : "text-positive"
		},
		links      : {
			label     : "Links",
			count     : 0,
			lowLimit  : 0,
			medLimit  : 1,
			highLimit : 2,
			percentage: Math.round((100 / 0) * 1),
			strokeCls : "text-positive"
		},
		emojies    : {
			label     : "Emojies",
			count     : 0,
			lowLimit  : 0,
			medLimit  : 1,
			highLimit : 2,
			percentage: Math.round((100 / 0) * 1),
			strokeCls : "text-positive"
		}
	};

	return (
		<div
			className={
				"p-2 grid grid-cols-2 lg:grid-cols-4 gap-y-2 text-xs opacity-70 dark:opacity-50"
			}
		>
			{Object.entries(stats).map(([key, value]) => (
				<div className={"flex gap-2 items-center"} key={key}>
					<ProgressCircle
						value={value.percentage}
						strokeWidth={1}
						className={cn(
							"size-4", value.strokeCls
						)}
						circleProps={{
							className: "stroke-muted-foreground/40 dark:stroke-primary-lighter",
						}}
					/>
					<div>
						<b>{value.label}</b> {value.count} / {value.highLimit}
					</div>
				</div>
			))}
		</div>
	);
}
