"use client";

import {Statusbar} from "#tiptap/components/tiptap-templates/simple/statusbar";
import * as React from "react";
import {EditorContent, EditorContext, useEditor, useEditorState} from "@tiptap/react";
import {CharacterCount} from '@tiptap/extensions';

import {Button as ShadButton} from "#/components/ui/button";


// --- Tiptap Core Extensions ---
import {StarterKit} from "@tiptap/starter-kit";
import {Image} from "@tiptap/extension-image";
import {TaskItem, TaskList} from "@tiptap/extension-list";
import {TextAlign} from "@tiptap/extension-text-align";
import {Typography} from "@tiptap/extension-typography";
import {Highlight} from "@tiptap/extension-highlight";
import {Subscript} from "@tiptap/extension-subscript";
import {Superscript} from "@tiptap/extension-superscript";
import {Selection} from "@tiptap/extensions";

// --- UI Primitives ---
import {Button} from "#tiptap/components/tiptap-ui-primitive/button";
import {Spacer} from "#tiptap/components/tiptap-ui-primitive/spacer";
import {
	Toolbar,
	ToolbarGroup,
	ToolbarSeparator,
} from "#tiptap/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import {ImageUploadNode} from "#tiptap/components/tiptap-node/image-upload-node/image-upload-node-extension";
import {HorizontalRule} from "#tiptap/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "#tiptap/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "#tiptap/components/tiptap-node/code-block-node/code-block-node.scss";
import "#tiptap/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "#tiptap/components/tiptap-node/list-node/list-node.scss";
import "#tiptap/components/tiptap-node/image-node/image-node.scss";
import "#tiptap/components/tiptap-node/heading-node/heading-node.scss";
import "#tiptap/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import {HeadingDropdownMenu} from "#tiptap/components/tiptap-ui/heading-dropdown-menu";
import {ImageUploadButton} from "#tiptap/components/tiptap-ui/image-upload-button";
import {ListDropdownMenu} from "#tiptap/components/tiptap-ui/list-dropdown-menu";
import {BlockquoteButton} from "#tiptap/components/tiptap-ui/blockquote-button";
import {CodeBlockButton} from "#tiptap/components/tiptap-ui/code-block-button";
import {
	ColorHighlightPopover,
	ColorHighlightPopoverContent,
	ColorHighlightPopoverButton,
} from "#tiptap/components/tiptap-ui/color-highlight-popover";
import {
	LinkPopover,
	LinkContent,
	LinkButton,
} from "#tiptap/components/tiptap-ui/link-popover";
import {MarkButton} from "#tiptap/components/tiptap-ui/mark-button";
import {TextAlignButton} from "#tiptap/components/tiptap-ui/text-align-button";
import {UndoRedoButton} from "#tiptap/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import {ArrowLeftIcon} from "#tiptap/components/tiptap-icons/arrow-left-icon";
import {HighlighterIcon} from "#tiptap/components/tiptap-icons/highlighter-icon";
import {LinkIcon} from "#tiptap/components/tiptap-icons/link-icon";

// --- Hooks ---
import {useIsMobile} from "#tiptap/hooks/use-mobile";
import {useWindowSize} from "#tiptap/hooks/use-window-size";
import {useCursorVisibility} from "#tiptap/hooks/use-cursor-visibility";


// --- Lib ---
import {handleImageUpload, MAX_FILE_SIZE} from "#tiptap/lib/tiptap-utils";

// --- Styles ---
import "#tiptap/components/tiptap-templates/simple/simple-editor.scss";

const MainToolbarContent = (
	{
		onHighlighterClick,
		onLinkClick,
		isMobile,
	}: {
		onHighlighterClick: () => void
		onLinkClick: () => void
		isMobile: boolean
	}) => {
	return (
		<>
			<Spacer/>

			<ToolbarGroup className={"hidden lg:flex"}>
				<UndoRedoButton action="undo"/>
				<UndoRedoButton action="redo"/>
			</ToolbarGroup>

			<ToolbarSeparator className={"hidden lg:flex"}/>

			<ToolbarGroup>
				<HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile}/>
				<ListDropdownMenu
					types={["bulletList", "orderedList"]}
					portal={isMobile}
				/>
				<BlockquoteButton/>
				<CodeBlockButton className={"hidden lg:flex"}/>
			</ToolbarGroup>

			<ToolbarSeparator/>

			<ToolbarGroup>
				<MarkButton type="bold"/>
				<MarkButton type="italic"/>
				<MarkButton type="strike"/>
				<MarkButton type="code" className={"hidden lg:flex"}/>
				<MarkButton type="underline"/>
				{!isMobile ? (
					<ColorHighlightPopover/>
				) : (
					<ColorHighlightPopoverButton onClick={onHighlighterClick}/>
				)}
				{!isMobile ? <LinkPopover/> : <LinkButton onClick={onLinkClick}/>}
			</ToolbarGroup>

			<ToolbarSeparator className={"hidden lg:flex"}/>

			<ToolbarGroup className={"hidden lg:flex"}>
				<MarkButton type="superscript"/>
				<MarkButton type="subscript"/>
			</ToolbarGroup>

			<ToolbarSeparator className={"hidden lg:flex"}/>

			<ToolbarGroup className={"hidden lg:flex"}>
				<TextAlignButton align="left"/>
				<TextAlignButton align="center"/>
				<TextAlignButton align="right"/>
				<TextAlignButton align="justify"/>
			</ToolbarGroup>

			<ToolbarSeparator/>

			<ToolbarGroup>
				<ImageUploadButton text="Add"/>
			</ToolbarGroup>

			<Spacer/>

			{isMobile && <ToolbarSeparator/>}
		</>
	);
};

const MobileToolbarContent = (
	{
		type,
		onBack,
	}: {
		type: "highlighter" | "link"
		onBack: () => void
	}) => (
	<>
		<ToolbarGroup>
			<Button data-style="ghost" onClick={onBack}>
				<ArrowLeftIcon className="tiptap-button-icon"/>
				{type === "highlighter" ? (
					<HighlighterIcon className="tiptap-button-icon"/>
				) : (
					<LinkIcon className="tiptap-button-icon"/>
				)}
			</Button>
		</ToolbarGroup>

		<ToolbarSeparator/>

		{type === "highlighter" ? (
			<ColorHighlightPopoverContent/>
		) : (
			<LinkContent/>
		)}
	</>
);

export type TSimpleEditorProps = {
	initialContent?: string;
}

export function SimpleEditor(p: TSimpleEditorProps) {
	const isMobile = useIsMobile();
	const {height} = useWindowSize();
	const [mobileView, setMobileView] = React.useState<
		"main" | "highlighter" | "link"
	>("main");
	const toolbarRef = React.useRef<HTMLDivElement>(null);

	const editor = useEditor({
		immediatelyRender          : false,
		shouldRerenderOnTransaction: false,
		editorProps                : {
			attributes: {
				autocomplete  : "off",
				autocorrect   : "off",
				autocapitalize: "off",
				"aria-label"  : "Main content area, start typing to enter text.",
				class         : "simple-editor",
			},
		},
		extensions                 : [
			StarterKit.configure({
				horizontalRule: false,
				link          : {
					openOnClick         : false,
					enableClickSelection: true,
				},
			}),
			HorizontalRule,
			TextAlign.configure({types: ["heading", "paragraph"]}),
			TaskList,
			TaskItem.configure({nested: true}),
			Highlight.configure({multicolor: true}),
			Image,
			Typography,
			Superscript,
			Subscript,
			Selection,
			ImageUploadNode.configure({
				accept : "image/*",
				maxSize: MAX_FILE_SIZE,
				limit  : 3,
				upload : handleImageUpload,
				onError: (error) => console.error("Upload failed:", error),
			}),
			CharacterCount,
		],
		content                    : p.initialContent,
	});


	const rect = useCursorVisibility({
		editor,
		overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
	});

	React.useEffect(() => {
		if (!isMobile && mobileView !== "main") {
			setMobileView("main");
		}
	}, [isMobile, mobileView]);

	return (
		<div className="simple-editor-wrapper">
			<EditorContext.Provider value={{editor}}>
				<Toolbar
					ref={toolbarRef}
					style={{
						...(isMobile
							? {
								bottom: `calc(100% - ${height - rect.y}px)`,
							}
							: {}),
					}}
				>
					{mobileView === "main" ? (
						<MainToolbarContent
							onHighlighterClick={() => setMobileView("highlighter")}
							onLinkClick={() => setMobileView("link")}
							isMobile={isMobile}
						/>
					) : (
						<MobileToolbarContent
							type={mobileView === "highlighter" ? "highlighter" : "link"}
							onBack={() => setMobileView("main")}
						/>
					)}
				</Toolbar>

				<EditorContent
					editor={editor}
					role="presentation"
					className="simple-editor-content "
				/>

				<div className={"bg-primary-foreground border-t px-4 pr-2 py-2 grid grid-cols-5 rounded-b-xl"}>
					<div className="col-span-4">
						<Statusbar editor={editor}/>
					</div>

					<ShadButton
						disabled={editor?.isEmpty}
						variant={"outline"}
						className={"cursor-pointer h-full shadow-none dark:border-none"}
					>
						Save
					</ShadButton>
				</div>
			</EditorContext.Provider>
		</div>
	);
}
