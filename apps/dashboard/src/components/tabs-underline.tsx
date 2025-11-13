import {Tabs, TabsList, TabsPanel, TabsTab} from "src/components/ui/tabs";

export default function TabsUnderline() {
	return (
		<Tabs defaultValue="tab-1">
			<div className="border-b">
				<TabsList variant="underline">
					<TabsTab value="tab-1">Tab 1</TabsTab>
					<TabsTab value="tab-2">Tab 2</TabsTab>
					<TabsTab value="tab-3">Tab 3</TabsTab>
				</TabsList>
			</div>
			<TabsPanel value="tab-1">
				<p className="p-4 text-center text-xs text-muted-foreground">
					Tab 1 content
				</p>
			</TabsPanel>
			<TabsPanel value="tab-2">
				<p className="p-4 text-center text-xs text-muted-foreground">
					Tab 2 content
				</p>
			</TabsPanel>
			<TabsPanel value="tab-3">
				<p className="p-4 text-center text-xs text-muted-foreground">
					Tab 3 content
				</p>
			</TabsPanel>
		</Tabs>
	);
}
