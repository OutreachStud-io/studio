"use client";

import {ScheduleBadge} from "@/components/campaigns/campaign/sequences/schedule-badge";
import {SequenceStatusIcons} from "@/components/campaigns/campaign/sequences/status-icons";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";

import {TSelectCampaignSequence, TSelectCampaignSequenceVersion} from "@outreachstudio/db/schema";

import {SimpleEditor} from '#tiptap/components/tiptap-templates/simple/simple-editor';
import {Input} from "@/components/ui/input";

import '#tiptap/styles/_variables.scss';
import '#tiptap/styles/_keyframe-animations.scss';

import {
	Card,
	CardAction,
	CardContent, CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {clsx} from "clsx";
import {Plus, Trash2} from "lucide-react";
import React from "react";


export type TSequence = {
	sequenceNumber: number;
	sequence: TSelectCampaignSequence
	versions?: TSelectCampaignSequenceVersion[]
}

export function Sequence(p: TSequence) {
	return (
		<div className="flex gap-4">
			<div className="flex-1">
				<Tabs defaultValue="tab-1" className={"flex flex-row "}>
					<div className="flex flex-col items-center gap-2 pt-2">
						<Badge className="size-8 rounded-full px-1">
							{p.sequenceNumber}
						</Badge>

						<div>
							<TabsList className={"flex flex-col h-full flex-1"}>
								{p.versions?.map((version: TSelectCampaignSequenceVersion, k) => (
									<TabsTrigger
										key={k}
										className={"size-8 cursor-pointer"}
										value={`tab-${k + 1}`}
									>{k + 1}</TabsTrigger>
								))}

								<TabsTrigger className={"size-8"} value={`tab-new`}>
									<Plus className={"size-4"}/>
								</TabsTrigger>
							</TabsList>
						</div>
					</div>

					{p.versions?.map((version: TSelectCampaignSequenceVersion, k) => (
						<TabsContent key={`content-` + k} value={`tab-${k + 1}`}>
							<SequenceVersion sequence={p} version={version}/>
						</TabsContent>
					))}

					<TabsContent key={`content-tab-new`} value={`tab-new`}>
						<SequenceVersion sequence={p}/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export function SequenceVersion(
	{
		sequence, version,
	}: {
		sequence: TSequence,
		version?: TSelectCampaignSequenceVersion,
	}) {
	return (
		<Card className={"bg-sidebar shadow-none p-0 gap-0"}>
			<CardHeader className={"!p-4 !pb-2 m-0 border-b bg-sidebar rounded-t-xl"}>
				<CardTitle className={"flex-1 flex gap-4"}>
					<div className="flex-1">
						<SequenceStatusIcons sequence={sequence}/>
					</div>

					<ScheduleBadge
						delayDays={sequence.sequence.delayDays ?? 0}
						isFirstSequence={sequence.sequenceNumber == 1}
					/>
				</CardTitle>

				<CardDescription className={"flex-1 flex items-center gap-2"}>
					<div className={"text-sm"}>Subject</div>

					<Input
						className={clsx(
							"border-none shadow-none text-primary bg-transparent!",
							"focus-visible:ring-0 focus-visible:bg-background/60! w-full",
						)}
						value={version?.contentSubject}
						onChange={(e) => {
							// handle subject change
						}}
						placeholder={"Enter email subject..."}
					/>
				</CardDescription>

				<CardAction className={"items-center"}>
					<Button size={"sm"} variant={"ghost"} className={clsx(
						"mt-1 cursor-pointer text-muted-foreground hover:text-destructive size-4"
					)}>
						<Trash2/>
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent className={"p-0"}>
				<SimpleEditor
					initialContent={version?.contentBody}
				/>
			</CardContent>
		</Card>
	);
}
